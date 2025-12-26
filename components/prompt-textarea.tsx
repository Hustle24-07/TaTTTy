"use client";

import { useId } from "react";
import { LoaderGooeyBlobs } from "@/components/gooey-blobs";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

interface PromptTextareaProps {
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	onSubmit?: () => void;
	isLoading?: boolean;
	placeholder?: string;
	label?: string;
	rows?: number;
	className?: string;
	showButton?: boolean;
}

export function PromptTextarea({
	value,
	onChange,
	onKeyDown,
	onSubmit,
	isLoading = false,
	placeholder = "Enter your prompt here...",
	label = "Prompt",
	rows = 3,
	className = "",
	showButton = false,
}: PromptTextareaProps) {
	const id = useId();
	return (
		<div className="space-y-2">
			<Label htmlFor={id} className="font-medium">
				{label}
			</Label>
			<InputGroup className={className}>
				<InputGroupTextarea
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					rows={rows}
				/>
			</InputGroup>
			{showButton && (
				<div className="pt-2">
					<Button
						onClick={onSubmit}
						disabled={isLoading || !value.trim()}
						size="lg"
						className="w-full rounded-full"
					>
						{isLoading && <LoaderGooeyBlobs className="mr-2" size={16} />}
						Create Now
					</Button>
				</div>
			)}
		</div>
	);
}
