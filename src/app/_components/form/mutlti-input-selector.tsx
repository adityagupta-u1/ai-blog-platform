
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";





export default function MultiTagSelect({ selectedTags, setValue, options }:{
  selectedTags: string[];
  setValue:UseFormSetValue<{
    tags: string[];
    category:string;
    file: File;
    status:string
}>
  options:  { id: string; name: string; }[] | undefined;
}) {
    const toggleTag = (tagValue:string) => {
        const newTags = selectedTags.includes(tagValue)
        ? selectedTags.filter((value) =>  value !== tagValue)
        : [...selectedTags, tagValue];

        setValue("tags", newTags,{ shouldValidate: true, shouldTouch: true, shouldDirty: true }); // ✅ pass actual array, not a function
    };


  return (
    <Popover>
      <PopoverTrigger asChild>
            <div className="flex items-center justify-between w-full p-2 border rounded-md cursor-pointer">
            <span>
                {selectedTags.length > 0
                ? options && options
                    .filter((tag) => selectedTags.includes(tag.id))
                    .map((t) => t.name)
                    .join(", ")
                : "Select tags"}
            </span>
            <ChevronDown className="w-4 h-4" />
            </div>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandGroup>
            {options && options.map((tag) => (
              <CommandItem
                key={tag.id}
                value={tag.id}
                onSelect={() => toggleTag(tag.id)}
                className="cursor-pointer"
              >
                <div className="mr-2">
                  <Check
                    className={`h-4 w-4 ${selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"}`}
                  />
                </div>
                {tag.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    
  );
}
