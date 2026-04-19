import { useNavigate } from "react-router-dom";
import type { VmiProgramSummary } from "@/data/vmiProgramsData";
import { cn } from "@/lib/utils";
import { severityPillStyles, statusPillStyles } from "./vmiStyles";

interface Props {
  programs: VmiProgramSummary[];
}

function displayProgramName(programName: string) {
  return programName.replace(/\s+VMI$/, "");
}

export function VmiProgramTable({ programs }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1320px] text-xs">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            {[
              "Program Name",
              "Customer",
              "Contract Period",
              "No. of SKUs",
              "No. of Locations / DCs",
              "On Hand Inventory",
              "Total Contract Quantity",
              "Confirmed Inbound",
              "Avg Weekly Pull",
              "Weeks of Cover",
              "Service Risk",
              "Fill Rate / OTF",
              "Open Exceptions",
              "Last Updated",
            ].map((label) => (
              <th key={label} className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {programs.map((program) => (
            <tr
              key={program.id}
              onClick={() => navigate(`/vmi-programs/${program.id}`)}
              className="cursor-pointer border-b border-border/60 transition-colors hover:bg-accent/40"
            >
              <td className="px-3 py-2.5">
                <div className="space-y-1">
                  <div className="font-medium text-foreground">{displayProgramName(program.programName)}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", statusPillStyles[program.status])}>
                      {program.status}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-foreground">{program.customer}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{program.contractPeriod}</td>
              <td className="px-3 py-2.5 text-foreground">{program.skuCount}</td>
              <td className="px-3 py-2.5 text-foreground">{program.locationCount}</td>
              <td className="px-3 py-2.5 text-foreground">{program.onHandInventory}</td>
              <td className="px-3 py-2.5 text-foreground">{program.totalContractQuantity}</td>
              <td className="px-3 py-2.5 text-foreground">{program.confirmedInbound}</td>
              <td className="px-3 py-2.5 text-foreground">{program.avgWeeklyPull}</td>
              <td className="px-3 py-2.5 text-foreground">{program.weeksOfCover}</td>
              <td className="px-3 py-2.5">
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", severityPillStyles[program.serviceRisk])}>
                  {program.serviceRisk}
                </span>
              </td>
              <td className="px-3 py-2.5 text-foreground">{program.fillRateOtf}</td>
              <td className="px-3 py-2.5 text-foreground">{program.openExceptions}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{program.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
