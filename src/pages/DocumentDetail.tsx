import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { DocumentDetailPanel } from "@/components/workflow/DocumentDetailPanel";
import { mockDocuments } from "@/data/mockDocuments";

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocuments.find((d) => d.id === id);

  if (!doc) {
    return (
      <AppLayout>
        <div className="p-6 text-center text-muted-foreground">Document not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Document Detail</h1>
            <p className="text-sm text-muted-foreground">Review and verify the selected source document.</p>
          </div>
        </div>

        <DocumentDetailPanel doc={doc} />
      </div>
    </AppLayout>
  );
};

export default DocumentDetail;
