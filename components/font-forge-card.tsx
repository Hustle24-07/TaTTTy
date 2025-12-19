"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";

export function FontForgeCard() {
	return (
		<Card className="w-full max-w-[400px] min-h-[600px]">
			<CardContent className="flex flex-col gap-8 p-6">
				{/* Row 1: Label and Resizable Textarea */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						PLEASE ENTER YOUR TEXT
					</label>
					<InputGroup>
						<InputGroupTextarea
							placeholder="Enter text here..."
							className="min-h-[80px] resize-y"
						/>
					</InputGroup>
				</div>

				{/* Row 3: Two Badges Side by Side */}
				<div className="flex w-full gap-4">
					<Badge 
						variant="secondary" 
						className="flex-1 h-10 text-base justify-center bg-white text-black hover:bg-white/90 ring-2 ring-primary border-transparent shadow-sm"
					>
						BLACK
					</Badge>
					<Badge 
						variant="secondary" 
						className="flex-1 h-10 text-base justify-center bg-white text-black hover:bg-white/90 border border-input shadow-sm"
					>
						COLORS
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
