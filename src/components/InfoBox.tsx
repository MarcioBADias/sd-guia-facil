import { Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InfoBoxProps {
  type?: "info" | "warning" | "success" | "tip";
  title?: string;
  children: React.ReactNode;
}

const InfoBox = ({ type = "info", title, children }: InfoBoxProps) => {
  const getConfig = () => {
    switch (type) {
      case "warning":
        return {
          icon: AlertTriangle,
          className: "border-yellow-200 bg-yellow-50 dark:border-yellow-900/20 dark:bg-yellow-900/10",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          titleColor: "text-yellow-800 dark:text-yellow-300"
        };
      case "success":
        return {
          icon: CheckCircle,
          className: "border-green-200 bg-green-50 dark:border-green-900/20 dark:bg-green-900/10",
          iconColor: "text-green-600 dark:text-green-400",
          titleColor: "text-green-800 dark:text-green-300"
        };
      case "tip":
        return {
          icon: Lightbulb,
          className: "border-primary/20 bg-primary/5 dark:border-primary/20 dark:bg-primary/5",
          iconColor: "text-primary",
          titleColor: "text-primary-dark dark:text-primary-light"
        };
      default:
        return {
          icon: Info,
          className: "border-blue-200 bg-blue-50 dark:border-blue-900/20 dark:bg-blue-900/10",
          iconColor: "text-blue-600 dark:text-blue-400",
          titleColor: "text-blue-800 dark:text-blue-300"
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Alert className={`my-4 ${config.className}`}>
      <Icon className={`h-4 w-4 ${config.iconColor}`} />
      <AlertDescription>
        {title && (
          <div className={`font-semibold mb-1 ${config.titleColor}`}>
            {title}
          </div>
        )}
        <div className="text-sm">
          {children}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default InfoBox;