import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, ArrowDown, Pencil, Trash } from "lucide-react";

type ProjectReport = {
  id: string;
  name: string;
  createdAt: string;
};

export default function ProjectReports({
  reports,
}: {
  reports: ProjectReport[];
}) {
  return (
    <div className="p-1">
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            Project Reports
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left"> </th>
                  <th className="px-4 py-3 text-left">REPORT NAME</th>
                  <th className="px-4 py-3 text-left">CREATED DATE</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {reports?.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="px-4 py-3 font-medium">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 p-2"
                        >
                          <ArrowDown
                            className="h-5 w-5 text-white"
                            strokeWidth={3}
                          />
                        </Button>
                      </td>
                      <td className="px-4 py-3 font-medium">
                         {report.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {report.createdAt}
                      </td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        
                        <Button size="sm" variant="secondary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No Project reports found. Click{" "}
                      <b>Create Project Report</b> to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
