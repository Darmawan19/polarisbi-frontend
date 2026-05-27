"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { GripVerticalIcon, TrendingUp, TrendingDown, Columns3Icon, ChevronDownIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const schema = z.object({
  id: z.number(),
  company: z.string(),
  premium: z.number(),
  marketShare: z.number(),
  rbc: z.number(),
  growth: z.number(),
  channel: z.string(),
});

type Row_ = z.infer<typeof schema>;

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent cursor-grab"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function RBCBadge({ value }: { value: number }) {
  const color =
    value > 250
      ? "bg-accent/10 text-accent border-accent/20"
      : value >= 200
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      : "bg-destructive/10 text-destructive border-destructive/20";
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded text-[11px] font-medium tabular-nums border",
        color
      )}
    >
      {value.toLocaleString("id-ID")}%
    </span>
  );
}

function ChannelChip({ channel }: { channel: string }) {
  const colors: Record<string, string> = {
    Agency: "bg-primary/10 text-primary border-primary/20",
    Bancassurance: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    "Multi-channel": "bg-chart-3/10 text-chart-3 border-chart-3/20",
    Digital: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  };
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border",
        colors[channel] ?? "bg-muted/40 text-muted-foreground border-border/40"
      )}
    >
      {channel}
    </span>
  );
}

const columns: ColumnDef<Row_>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.company === "BRI Life" && (
          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
        )}
        <span
          className={cn(
            "text-[13px]",
            row.original.company === "BRI Life"
              ? "font-semibold text-foreground"
              : "text-foreground"
          )}
        >
          {row.original.company}
        </span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "premium",
    header: () => <div className="text-right">Q4 Premium (Rp T)</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums text-[13px]">
        {row.original.premium.toFixed(1)}
      </div>
    ),
  },
  {
    accessorKey: "marketShare",
    header: () => <div className="text-right">Market Share</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums text-[13px]">
        {row.original.marketShare.toFixed(1)}%
      </div>
    ),
  },
  {
    accessorKey: "rbc",
    header: () => <div className="text-right">RBC</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <RBCBadge value={row.original.rbc} />
      </div>
    ),
  },
  {
    accessorKey: "growth",
    header: () => <div className="text-right">Growth YoY</div>,
    cell: ({ row }) => {
      const g = row.original.growth;
      return (
        <div className="flex items-center justify-end gap-1">
          {g >= 0 ? (
            <TrendingUp className="h-3 w-3 text-accent" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span
            className={cn(
              "tabular-nums text-[13px]",
              g >= 0 ? "text-accent" : "text-destructive"
            )}
          >
            {g >= 0 ? "+" : ""}
            {g.toFixed(1)}%
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => <ChannelChip channel={row.original.channel} />,
  },
];

function DraggableRow({ row }: { row: Row<Row_> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  const isBRILife = row.original.company === "BRI Life";
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 transition-colors",
        isBRILife && "bg-primary/5 border-l-2 border-l-primary/40"
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data: initialData }: { data: Row_[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const sortableId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="w-full flex flex-col gap-4 px-6 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">
            Top 10 Perusahaan Asuransi Jiwa
          </span>
          <Badge variant="outline" className="text-[11px] px-1.5 py-0 text-muted-foreground">
            Q4 2024 · OJK
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter company..."
            value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("company")?.setFilterValue(e.target.value)
            }
            className="h-7 w-40 text-[12px] bg-card/40 border-border/60"
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" className="h-7 text-[12px]" />}
            >
              <Columns3Icon className="h-3.5 w-3.5" />
              Columns
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {table
                .getAllColumns()
                .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize text-[12px]"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border/60">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-[13px] text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[12px] text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
