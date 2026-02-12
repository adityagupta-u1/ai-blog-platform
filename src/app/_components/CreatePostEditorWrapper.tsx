'use client';
import GenerateTitle from "@/app/_components/form/generateTitle";
import { TitleContext } from "@/app/_context/TitleContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Edit, FileText, Sparkles } from "lucide-react";
import { FC, useState } from "react";
import Form from "../_components/form/editorForm";

interface CreatePostEditorWrapperProps {
    category: {
        id: string;
        name: string;
    }[];
    tags: {
        id: string;
        name: string;
    }[]
}

const steps = [
  { id: 1, name: 'Generate Title', icon: Sparkles },
  { id: 2, name: 'Create Content', icon: Edit },
  { id: 3, name: 'Review & Publish', icon: CheckCircle },
];

const CreatePostEditorWrapper: FC<CreatePostEditorWrapperProps> = ({ category, tags }) => {
  const [title, setTitle] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  // const [content, setContent] = useState<string>("");

  return (
    <TitleContext.Provider value={{ title, setTitle, step, setStep }}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Post
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow the steps below to create your blog post with AI assistance
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${step >= s.id 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted-foreground/25 text-muted-foreground'
                    }
                    transition-all duration-300
                  `}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className={`
                    ml-3 text-sm font-medium hidden sm:block
                    ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {s.name}
                  </span>
                  {s.id < steps.length && (
                    <div className={`
                      w-12 h-0.5 mx-4 hidden sm:block
                      ${step > s.id ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(step / steps.length) * 100} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {steps[step - 1] && (() => {
                    const Icon = steps[step - 1].icon;
                    return <Icon className="h-5 w-5 text-primary" />;
                  })()}
                </div>
                <div>
                  <CardTitle>{steps[step - 1]?.name}</CardTitle>
                  <CardDescription>
                    {step === 1 && "Generate a compelling title for your blog post"}
                    {step === 2 && "Create engaging content with AI assistance"}
                    {step === 3 && "Review and publish your post"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {step === 1 && <GenerateTitle />}
              {step === 2 && <Form tags={tags} category={category} />}
              {step === 3 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to publish?</h3>
                  <p className="text-muted-foreground mb-6">
                    Review your post one last time before publishing
                  </p>
                  <Button size="lg" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Publish Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TitleContext.Provider>
  );
}

export default CreatePostEditorWrapper;