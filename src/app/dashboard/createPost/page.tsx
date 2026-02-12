import CreatePostEditorWrapper from "@/app/_components/CreatePostEditorWrapper";
import { api } from "@/trpc/server";


export default async function Dashboard() {

  // TODO: Make multi step form
  // FIRST STEP: Make a generate title step, for the user to generate a title or use its own, if generated, select the one to be used or regenerate
  // SECOND STEP: Make a generate content step, for the user to generate content, allow the user to regenerate content or to start editing or publish
  // THIRD STEP: If editing, input the content in the editor, and allow the user to publish or save as draft
  // FOURTH STEP: If publish, save the post and redirect to the post page
  // FIFTH STEP: If save as draft, save the post and redirect to the dashboard
  // SIXTH STEP: If cancel, redirect to the dashboard

  // const contextValue = {
  //   title,
  //   setTitle
  // }

  const tags = await api.tags.getTags();
  const categories = await api.categories.getCategories();

  return (
    <CreatePostEditorWrapper
      category={categories}
      tags={tags}
     />
  );
}
