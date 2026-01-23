import { Card, CardContent } from "@/components/ui/card";
import { CalendarPlus, FileText } from "lucide-react";

type KPIData = {
  totalReports: number;
  todayReports: number;
};

export default function ReportsKPI({ kpi }: { kpi: KPIData }) {
  return (
    <div className="flex gap-4">

      {/* Total Reports */}
      <Card className="w-40 bg-green-200 border-border border">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-foreground">
            <FileText className="h-4 w-4" />
            <span className="text-bold-lg font-medium">Total Reports</span>
          </div>
          <h2 className="text-2xl font-bold">
            {kpi.totalReports}
          </h2>
        </CardContent>
      </Card>

      {/* Today Reports */}
      <Card className="w-40 bg-green-200 border-border border">
        <CardContent className="p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-foreground">
           
            <span className="text-bold-lg font-medium">
              New Reports Today
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            +{kpi.todayReports}
          </h2>
        </CardContent>
      </Card>

    </div>
  );
}
