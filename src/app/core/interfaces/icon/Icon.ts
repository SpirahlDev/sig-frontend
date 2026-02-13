import { TemplateRef } from "@angular/core";

export type IconType = 'svg' | 'url' | 'template' | 'material';

export interface Icon{
    icon:string | TemplateRef<any>;
    type:IconType;

    color?:string;
    height?:number;
    width?:number;
    class?:string;
    alt?:string;
}