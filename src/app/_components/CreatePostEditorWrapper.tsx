'use client';
import Form from "../_components/form/editorForm";

import GenerateTitle from "@/app/_components/form/generateTitle";
import { TitleContext } from "@/app/_context/TitleContext";
import { FC, useState } from "react";


interface CreatePostEditorWrapperProps {
    category:{
        id:string;
        name:string;
    }[];
    tags:{
        id:string;
        name:string;
    }[]
}

const CreatePostEditorWrapper:FC<CreatePostEditorWrapperProps> = ({category,tags}) => {

  // TODO: Make multi step form
  // FIRST STEP: Make a generate title step, for the user to generate a title or use its own, if generated, select the one to be used or regenerate
  // SECOND STEP: Make a generate content step, for the user to generate content, allow the user to regenerate content or to start editing or publish
  // THIRD STEP: If editing, input the content in the editor, and allow the user to publish or save as draft
  // FOURTH STEP: If publish, save the post and redirect to the post page
  // FIFTH STEP: If save as draft, save the post and redirect to the dashboard
  // SIXTH STEP: If cancel, redirect to the dashboard
  const [title,setTitle] = useState<string>("");
  const [step,setStep] = useState<number>(1);
  // const contextValue = {
  //   title,
  //   setTitle
  // }

  return (
    <TitleContext.Provider value={{title,setTitle,step,setStep}}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          { step === 1 && <GenerateTitle /> }
          { step === 2 && <Form tags={tags} category={category} />}
          {/* { step === 2 && <div>step is 2</div> } */}
        </div>
      </div>
    </TitleContext.Provider>
  );
}

export default CreatePostEditorWrapper;