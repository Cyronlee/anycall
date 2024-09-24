import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Snippet,
  Code,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { RequestLog } from "@/lib/types";

export default function IndexPage() {
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/data");
      const data = await response.json();

      setRequestLogs(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    // Set up automatic refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchData();
    }, 5 * 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleRowClick = (log: RequestLog) => {
    setSelectedLog(log);
  };

  const closeModal = () => {
    setSelectedLog(null);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const renderHeaders = (headers: any) => {
    return Object.entries(headers).map(([key, value]) => (
      <p key={key}>
        <strong>{key}:</strong>{" "}
        {Array.isArray(value) ? value.join(", ") : (value as string)}
      </p>
    ));
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <h1 className={title({ color: "violet" })}>API Request Monitor</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Easily track and analyze your API calls in real-time
          </p>
        </div>

        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
            <h2 className={title({ size: "sm", color: "white" })}>
              Quick Start Guide
            </h2>
          </CardHeader>
          <CardBody>
            <p className="mb-4">
              To monitor your API requests, simply send them to:
            </p>
            <Snippet
              hideSymbol
              className="bg-gray-100 dark:bg-gray-800"
              variant="flat"
            >
              <Code color="secondary">https://anycall.vercel.app/api/call</Code>
            </Snippet>
            <p className="mt-4">
              Your request details will be captured and displayed in the table
              below.
            </p>
          </CardBody>
        </Card>

        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader className="flex justify-between items-center bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
            <h2 className={title({ size: "sm", color: "white" })}>
              Recent API Calls
            </h2>
            <Button
              color="secondary"
              disabled={loading}
              isLoading={loading}
              onClick={handleRefresh}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </CardHeader>
          <CardBody>
            <Table aria-label="Table of recent API calls" className="mt-4">
              <TableHeader>
                <TableColumn>TIMESTAMP</TableColumn>
                <TableColumn>METHOD</TableColumn>
                <TableColumn>IP</TableColumn>
                <TableColumn>ORIGIN</TableColumn>
              </TableHeader>
              <TableBody>
                {requestLogs.map((log, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleRowClick(log)}
                  >
                    <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell>{log.method}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.origin || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </section>

      <Modal isOpen={!!selectedLog} size="3xl" onClose={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Request Details
              </ModalHeader>
              <ModalBody>
                {selectedLog && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p>
                        <strong>Timestamp:</strong>{" "}
                        {formatTimestamp(selectedLog.timestamp)}
                      </p>
                      <p>
                        <strong>Method:</strong> {selectedLog.method}
                      </p>
                      <p>
                        <strong>IP:</strong> {selectedLog.ip}
                      </p>
                      <p>
                        <strong>Origin:</strong> {selectedLog.origin || "N/A"}
                      </p>
                      <p>
                        <strong>Browser:</strong> {selectedLog.browser}
                      </p>
                      <p>
                        <strong>OS:</strong> {selectedLog.os}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Query:</strong>
                      </p>
                      <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(selectedLog.query, null, 2)}
                      </pre>
                      <p>
                        <strong>Body:</strong>
                      </p>
                      <pre className="bg-gray-100 p-2 rounded">
                        {JSON.stringify(selectedLog.body, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                {selectedLog && (
                  <div className="mt-4">
                    <p>
                      <strong>Headers:</strong>
                    </p>
                    <div className="bg-gray-100 p-2 rounded max-h-60 overflow-y-auto">
                      {renderHeaders(selectedLog.headers)}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
