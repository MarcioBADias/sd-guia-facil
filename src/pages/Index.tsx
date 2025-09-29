import { useState } from "react";
import DocLayout from "@/components/DocLayout";
import DocumentationContent from "@/components/DocumentationContent";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("introduction");

  return (
    <DocLayout 
      currentSection={currentSection} 
      onSectionChange={setCurrentSection}
    >
      <DocumentationContent section={currentSection} />
    </DocLayout>
  );
};

export default Index;
