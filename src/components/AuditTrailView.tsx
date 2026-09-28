import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Download, RefreshCw, User, X, ArrowUpDown } from "lucide-react";
import { initialAuditLogs } from "../mockData";
import { AuditLog } from "../types";

export function AuditTrailView() {
  const [searchUser, setSearchUser] = useState("");
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2026-12-31");
  const [logs, setLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [submitted, setSubmitted] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const query = searchUser.trim().toLowerCase();
    const filtered = initialAuditLogs.filter((l) => {
      if (!query) return true;
      return (
        l.forUser.toLowerCase().includes(query) ||
        l.forUserId.toLowerCase().includes(query) ||
        l.byUser.toLowerCase().includes(query) ||
        l.byUserId.toLowerCase().includes(query) ||
        l.actionPerformed.toLowerCase().includes(query) ||
        l.userName.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query)
      );
    });
    setLogs(filtered);
  };

  const handleReset = () => {
    setSearchUser("");
    setFromDate("2024-01-01");
    setToDate("2026-12-31");
    setLogs(initialAuditLogs);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-left"
    >
      {/* Title & Accent Stepper */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h2 className="text-[22px] font-black text-[#1A253C] font-sans tracking-tight">
            Audit Trail
          </h2>
          <div className="flex items-center space-x-1 mt-2">
            <div className="h-1 w-14 bg-[#EAB308] rounded-full"></div>
            <div className="h-1 w-6 bg-[#22C55E] rounded-full"></div>
            <div className="h-1 w-1.5 bg-[#EAB308] rounded-full"></div>
            <div className="h-1 w-1 bg-[#EAB308] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Query panel */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200/60 shadow-xs text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Search User</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter email, user ID, name, or action..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#447837]/20 focus:border-[#447837] focus:outline-none pl-9 font-semibold text-gray-800"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#447837]/20 focus:border-[#447837] focus:outline-none text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#447837]/20 focus:border-[#447837] focus:outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-gray-200/50">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#447837] text-white rounded-lg text-xs font-bold hover:bg-[#36602A] transition shadow-xs flex items-center gap-1.5"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Main Audit Log Table (Image 1 Format) */}
      {submitted && (
        <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-xs space-y-3 p-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-gray-700">
              Audit Trail Records ({logs.length} {logs.length === 1 ? 'record' : 'records'})
            </span>
            <button
              onClick={() => alert("Audit trail report downloaded successfully")}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              Export Report
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-thin rounded-lg border border-gray-200">
            <table className="min-w-max w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-700 text-[12px] font-bold tracking-tight border-b border-gray-200 whitespace-nowrap">
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">Timestamp <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">Action Performed <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">For User <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">For User ID <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">By User <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">By User ID <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">Rejected Case <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">Field Modified <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">Specific Value <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">Old Value <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 border-r border-gray-200/70">
                    <div className="flex items-center gap-1">New Value <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                  <th className="px-3.5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">Remark <ArrowUpDown className="w-3 h-3 text-gray-400" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700 whitespace-nowrap bg-white">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.timestamp}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 font-sans text-gray-800">{log.actionPerformed}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-gray-800">{log.forUser}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.forUserId}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.byUser}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.byUserId}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.rejectedCase}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.fieldModified}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.specificValue}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.oldValue}</td>
                      <td className="px-3.5 py-3 border-r border-gray-100 text-gray-700 font-sans">{log.newValue}</td>
                      <td className="px-3.5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-3.5 py-1 border border-[#447837] text-[#447837] hover:bg-[#447837] hover:text-white rounded text-xs font-semibold transition cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-gray-400 italic font-sans">
                      No audit trail records found matching your query parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Format Detail Modal (Image 2 Format) */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-300"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-black text-gray-900 font-sans">
                  Report Format-
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="text-white bg-[#447837] hover:bg-[#36602A] p-1.5 rounded-full shadow-xs transition duration-150 flex items-center justify-center cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Report Format Table matching Image 2 */}
              <div className="p-6 overflow-y-auto space-y-4">
                <p className="text-xs text-gray-500 font-semibold">
                  Audit Trail Detail View for Record <span className="font-bold text-gray-800">#{selectedLog.id}</span> ({selectedLog.forUser})
                </p>

                <div className="border-2 border-black rounded-xs overflow-hidden">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="bg-gray-100 text-gray-900 font-bold border-b-2 border-black">
                        <th className="px-4 py-2.5 border-r-2 border-black w-1/4">Column Name</th>
                        <th className="px-4 py-2.5 border-r-2 border-black w-1/2">Description</th>
                        <th className="px-4 py-2.5 w-1/4">Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-black text-gray-900 bg-white">
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">LoginTime</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The timestamp when the user logged in.</td>
                        <td className="px-4 py-2 font-mono text-gray-900">{selectedLog.loginTime}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">LogoutTime</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The timestamp when the user logged out.</td>
                        <td className="px-4 py-2 font-mono text-gray-900">{selectedLog.logoutTime}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">Status</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Indicates the outcome or status of the activity (e.g., Success, Failed).</td>
                        <td className="px-4 py-2 font-semibold text-gray-900">{selectedLog.status}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">loginId</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Unique identifier for the login session.</td>
                        <td className="px-4 py-2 font-mono text-gray-900">{selectedLog.loginId}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">UserName</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The system username of the user. Login user</td>
                        <td className="px-4 py-2 font-semibold text-gray-900">{selectedLog.userName}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">FirstName</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">User's first name. Login user</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.firstName}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">LastName</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">User's last name. Login user</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.lastName}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">Activity</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The specific action performed by the user.</td>
                        <td className="px-4 py-2 font-medium text-gray-900">{selectedLog.activity}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">RequestingUserName</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Username of the person who initiated the request (if different from UpdatedBy).</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.requestingUserName}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">UpdatedBy</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Username or role of the person who performed the update.</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.updatedBy}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">MobileNumber</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The user's registered mobile number.</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.mobileNumber}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">Email</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The registered email address of the user.</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.email}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">Updated time</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Time of activity performed</td>
                        <td className="px-4 py-2 font-mono text-gray-900">{selectedLog.updatedTime}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">UserRole</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Role assigned to the user in the system.</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.userRole}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">StatusDescription</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Detailed description of the activity status or reason.</td>
                        <td className="px-4 py-2 text-gray-900">{selectedLog.statusDescription}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">IpAddress</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">IP address from which the action was performed.</td>
                        <td className="px-4 py-2 font-mono text-gray-900">{selectedLog.ipAddress}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">OldValue</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The original value before an update (used for audit trails).</td>
                        <td className="px-4 py-2 text-gray-900 font-mono">{selectedLog.oldValue}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">NewValue</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">The updated value after the change.</td>
                        <td className="px-4 py-2 text-gray-900 font-mono">{selectedLog.newValue}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-r-2 border-black font-semibold">LatLong</td>
                        <td className="px-4 py-2 border-r-2 border-black text-gray-800">Latitude and Longitude of the user's location.</td>
                        <td className="px-4 py-2 font-mono text-gray-900">{selectedLog.latLong}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2 bg-[#447837] hover:bg-[#36602A] text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

