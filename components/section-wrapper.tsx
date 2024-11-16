import React from 'react';
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";

interface SectionWrapperProps {
    title: string;
    description?: string;
    totalItems?: number;
    action?: React.ReactNode;
    children?: React.ReactNode;
}

export default function SectionWrapper({ title, description, totalItems, action, children }: SectionWrapperProps) {
    return (
        <>
            <div className="flex items-start justify-between">
                <Heading
                    title={`${title}${totalItems !== undefined ? ` (${totalItems})` : ''}`}
                    description={description || ""}
                />
                {action && (
                    <div>{action}</div>
                )}
            </div>
            <Separator />
            {children}
        </>
    );
}
