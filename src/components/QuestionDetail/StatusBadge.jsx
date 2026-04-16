import { FaCheckCircle } from "react-icons/fa";

export default function StatusBadge({ status }) {
    const map = {
        OPEN: "bg-green-100 text-green-700 border-green-200",
        ACCEPTED: "bg-blue-100 text-blue-700 border-blue-200",
        CLOSED: "bg-gray-100 text-gray-500 border-gray-200",
    };
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${map[status] ?? map.OPEN}`}>
            {status === "ACCEPTED" && <FaCheckCircle className="text-blue-500" />}
            {status}
        </span>
    );
}
