import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StepCardProps {
  step: number;
  title: string;
  children: React.ReactNode;
  status?: "pending" | "completed" | "warning";
  important?: boolean;
}

const StepCard = ({ step, title, children, status = "pending", important = false }: StepCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className={`mb-6 transition-all duration-200 hover:shadow-medium ${important ? 'border-primary shadow-soft' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
            ${status === "completed" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : important
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
            }
          `}>
            {step}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {title}
              {getStatusIcon()}
            </CardTitle>
          </div>
          {important && (
            <Badge variant="secondary" className="bg-gradient-primary text-white border-0">
              Importante
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default StepCard;