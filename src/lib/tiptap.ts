import ParagraphComponent from "@/app/_components/paragraphComponent";
// import { mergeAttributes, Node } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import { ReactNodeViewRenderer } from "@tiptap/react";

// export const ParagraphActions = Node.create({
//     name:"paragraphActions",
//     inline: true,
//     group: "inline",
//     draggable:false,
//     parseHTML(){
//         return  [{tag:'p'}] 
//     },
//     renderHTML({HTMLAttributes}){
//         return ['p',mergeAttributes({HTMLAttributes}),0]    
//     },
//     addNodeView() {
//         return ReactNodeViewRenderer(ParagraphComponent);
//     }
// })

export const ParagraphActions = Paragraph.extend({
    // name:"paragraphActions",
    // inline: true,
    // group: "inline",
    // draggable:false,
    // parseHTML(){
    //     return  [{tag:'p'}] 
    // },
    // renderHTML({HTMLAttributes}){
    //     return ['p',mergeAttributes({HTMLAttributes}),0]    
    // },
    addNodeView() {
        return ReactNodeViewRenderer(ParagraphComponent);
    }
})