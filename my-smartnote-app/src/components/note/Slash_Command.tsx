import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Gallery from "react-photo-gallery";
import { useTable, Column, HeaderGroup, Row } from "react-table";

const SLASH_COMMANDS = [
  { label: "Text", symbol: "T" },
  { label: "Heading 1", symbol: "#" },
  { label: "Heading 2", symbol: "##" },
  { label: "Heading 3", symbol: "###" },
  { label: "Bulleted list", symbol: "-" },
  { label: "Numbered list", symbol: "1." },
  { label: "To-do list", symbol: "[]" },
  { label: "Table", symbol: "table" },
  { label: "Gallery view", symbol: "gallery" },
  { label: "Calendar view", symbol: "calendar" },
];

interface TableData {
  col1: string;
  col2: string;
}

const sampleData: TableData[] = [
  { col1: "Hello", col2: "World" },
  { col1: "React", col2: "Table" },
];

const columns: Column<TableData>[] = [
  { Header: "Column 1", accessor: "col1" },
  { Header: "Column 2", accessor: "col2" },
];

export default function SlashCommand({ content, setContent }: { content: string; setContent: (value: string) => void }) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setShowMenu(true);
        setFilteredCommands(SLASH_COMMANDS);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommandSelect = (command: { label: string; symbol: string }) => {
    setShowMenu(false);
    setSelectedCommand(command.symbol);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<TableData>({ columns, data: sampleData });

  return (
    <div className="relative">
      <textarea
        ref={editorRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-80 mt-5 p-4 text-lg outline-none  rounded-md"
      />

      {showMenu && (
        <div className="absolute top-14 left-4 w-64 bg-white shadow-md rounded-md border">
          <div className="p-2 text-gray-500 text-sm">Basic blocks</div>
          {filteredCommands.map((cmd) => (
            <div
              key={cmd.label}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              onClick={() => handleCommandSelect(cmd)}
            >
              <span>{cmd.label}</span>
              <span className="text-gray-400">{cmd.symbol}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        {selectedCommand === "table" && (
          <table {...getTableProps()} className="w-full border mt-4">
            <thead>
              {headerGroups.map((headerGroup: HeaderGroup<TableData>) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} key={column.id} className="border p-2">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row: Row<TableData>) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.column.id} className="border p-2">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {selectedCommand === "gallery" && <Gallery photos={[
          { src: "https://via.placeholder.com/150", width: 4, height: 3 },
          { src: "https://via.placeholder.com/200", width: 1, height: 1 },
        ]} />}
        {selectedCommand === "calendar" && <Calendar />}
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}