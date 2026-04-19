import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { CoverageProjectionChart } from "@/components/vmi/CoverageProjectionChart";
import { DemandSignalPanel } from "@/components/vmi/DemandSignalPanel";
import { ExceptionsPanel } from "@/components/vmi/ExceptionsPanel";
import { FinanceExposurePanel } from "@/components/vmi/FinanceExposurePanel";
import { InboundSupplyTracker } from "@/components/vmi/InboundSupplyTracker";
import { InventoryCoverageTable } from "@/components/vmi/InventoryCoverageTable";
import { ProgramHeader } from "@/components/vmi/ProgramHeader";
import { ProgramKpiStrip } from "@/components/vmi/ProgramKpiStrip";
import { RelatedDeliveriesTable } from "@/components/vmi/RelatedDeliveriesTable";
import { VmiProgramTabs, type ProgramWorkspaceTab } from "@/components/vmi/VmiProgramTabs";
import { vmiProgramDetails } from "@/data/vmiProgramsData";
import type { DemandGranularity } from "@/data/vmiProgramsData";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const VmiProgramDetailPage = () => {
  const { programId } = useParams();
  const program = programId ? vmiProgramDetails[programId] : undefined;
  const [activeExceptionId, setActiveExceptionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProgramWorkspaceTab>("overview");
  const [demandGranularity, setDemandGranularity] = useState<DemandGranularity>("weekly");
  const [selectedCoverageSku, setSelectedCoverageSku] = useState("All SKUs");

  const activeException = useMemo(
    () => program?.exceptions.find((item) => item.id === activeExceptionId) ?? null,
    [activeExceptionId, program],
  );

  const coverageSkuOptions = useMemo(
    () => program?.coverageProjectionBySku.map((item) => item.label) ?? ["All SKUs"],
    [program],
  );

  const coveragePoints = useMemo(
    () =>
      program?.coverageProjectionBySku.find((item) => item.label === selectedCoverageSku)?.points ??
      program?.coverageProjectionBySku[0]?.points ??
      program?.coverageProjection ??
      [],
    [program, selectedCoverageSku],
  );

  useEffect(() => {
    setActiveTab("overview");
    setDemandGranularity("weekly");
    setActiveExceptionId(null);
    setSelectedCoverageSku("All SKUs");
  }, [programId]);

  if (!program) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center p-6">
          <div className="rounded-3xl border border-dashed border-border bg-card px-10 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">Program not found</p>
            <p className="mt-2 text-sm text-muted-foreground">Choose a VMI program from the list to open the control tower.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (program.state === "loading") {
    return (
      <AppLayout>
        <div className="space-y-5 p-6">
          <div className="h-28 rounded-3xl border border-border bg-card" />
          <div className="grid gap-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-32 rounded-2xl border border-border bg-card" />)}
          </div>
          <div className="h-96 rounded-3xl border border-border bg-card" />
        </div>
      </AppLayout>
    );
  }

  if (program.state === "error") {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center p-6">
          <div className="max-w-lg rounded-3xl border border-destructive/20 bg-card px-10 py-12 text-center">
            <p className="text-sm font-semibold text-foreground">Unable to load program control tower</p>
            <p className="mt-2 text-sm text-muted-foreground">{program.errorMessage}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProgramWorkspaceTab)} className="flex min-h-full flex-col">
        <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="space-y-3 px-5 pb-3 pt-5">
            <ProgramHeader program={program} />
            <VmiProgramTabs activeTab={activeTab} onChange={setActiveTab} exceptionCount={program.exceptions.length} />
          </div>
        </div>

        <div className="flex-1 min-h-0 px-5 pb-5 pt-4">
          <TabsContent value="overview" forceMount className="mt-0 data-[state=inactive]:hidden">
            <div className="space-y-5">
              <ProgramKpiStrip items={program.kpis} />
              <CoverageProjectionChart
                points={coveragePoints}
                skuOptions={coverageSkuOptions}
                selectedSku={selectedCoverageSku}
                onSkuChange={setSelectedCoverageSku}
              />
              <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
                <ExceptionsPanel
                  exceptions={program.exceptions}
                  activeExceptionId={activeExceptionId}
                  onSelectException={setActiveExceptionId}
                  title="Top Alerts"
                  limit={3}
                />
                <RelatedDeliveriesTable deliveries={program.relatedDeliveries} compact maxRows={3} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory" forceMount className="mt-0 data-[state=inactive]:hidden">
            <InventoryCoverageTable rows={program.inventoryCoverageRows} filteredRowIds={activeException?.inventoryRowIds} />
          </TabsContent>

          <TabsContent value="demand" forceMount className="mt-0 data-[state=inactive]:hidden">
            <DemandSignalPanel
              rows={program.demandSignalRows}
              filteredRowIds={activeException?.demandSignalIds}
              granularity={demandGranularity}
              onGranularityChange={setDemandGranularity}
              contractPace={{
                weekly: program.demandPace.weeklyContract,
                monthly: program.demandPace.monthlyContract,
              }}
            />
          </TabsContent>

          <TabsContent value="inbound" forceMount className="mt-0 data-[state=inactive]:hidden">
            <InboundSupplyTracker rows={program.inboundSupplyRows} filteredRowIds={activeException?.inboundRowIds} />
          </TabsContent>

          <TabsContent value="deliveries" forceMount className="mt-0 data-[state=inactive]:hidden">
            <RelatedDeliveriesTable deliveries={program.relatedDeliveries} />
          </TabsContent>

          <TabsContent value="exceptions" forceMount className="mt-0 data-[state=inactive]:hidden">
            <ExceptionsPanel exceptions={program.exceptions} activeExceptionId={activeExceptionId} onSelectException={setActiveExceptionId} />
          </TabsContent>

          <TabsContent value="finance" forceMount className="mt-0 data-[state=inactive]:hidden">
            <FinanceExposurePanel metrics={program.financeLens} />
          </TabsContent>
        </div>
      </Tabs>
    </AppLayout>
  );
};

export default VmiProgramDetailPage;
