
'use client';
import React, { FC } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface SingleInputSelectorProps {
    options: {
    id: string;
    name: string;
}[] | undefined
    value: string | undefined;
    valueChange: (value: string) => void;
}   

const SingleInputSelector: FC<SingleInputSelectorProps> = ({options,value ,valueChange}) => {

  return (
    <Select onValueChange={valueChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder="Select a verified email to display" />
        </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {
            options && options.map((option) => (
                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
            ))
            }
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SingleInputSelector;