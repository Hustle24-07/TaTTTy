"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import { FONT_STYLES, UI_TEXT } from "@/app/tattty/fonts/constants";
import { generateFontAction } from "@/app/actions/generate-font";
import { useToast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MediaModal } from "@/components/media-modal";

export function FontForgeCard() {
	const [selectedColor, setSelectedColor] = useState<'black' | 'colors'>('black');
	const [textInput, setTextInput] = useState("");
	const [selectedStyle, setSelectedStyle] = useState("");
	const [customizationInput, setCustomizationInput] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedImages, setGeneratedImages] = useState<string[]>([]);
	const { toast } = useToast();

	const handleGenerate = async () => {
		if (!textInput || !selectedStyle) {
			toast({
				title: "Missing Information",
				description: "Please enter text and select a style.",
				variant: "destructive",
			});
			return;
		}

		setIsGenerating(true);
		setGeneratedImages([]);
		try {
			const result = await generateFontAction({
				text: textInput,
				style: selectedStyle,
				color: selectedColor,
				customization: customizationInput
			});

			if (result.success && Array.isArray(result.output)) {
				setGeneratedImages(result.output as string[]);
				toast({
					title: "Success!",
					description: "Your font has been generated.",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to generate font.",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "Something went wrong.",
				variant: "destructive",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="flex flex-col items-center w-full gap-8">
			<Card className="w-full max-w-[500px] min-h-[600px] bg-card text-card-foreground translate-y-0 md:translate-y-[-50px]">
				<CardContent className="flex flex-col gap-6 p-4 md:gap-8 md:p-6">
					{/* Row 1: Label and Resizable Textarea */}
					<div className="flex flex-col gap-2">
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{UI_TEXT.enterTextLabel}
					</label>
					<InputGroup>
						<InputGroupTextarea
							placeholder={UI_TEXT.enterTextPlaceholder}
							className="min-h-[80px] max-h-[200px] overflow-y-auto resize-y"
							value={textInput}
							onChange={(e) => setTextInput(e.target.value)}
						/>
					</InputGroup>
				</div>

				{/* Row 3: Two Badges Side by Side */}
				<div className="flex flex-col gap-4 md:gap-6">
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{UI_TEXT.selectColorLabel}
					</label>
					<div className="flex w-full gap-4 md:gap-6">
						<Badge 
							variant="secondary" 
							className={cn(
								"flex-1 h-12 text-base justify-center bg-white text-black hover:bg-white/90 shadow-sm cursor-pointer transition-all",
								selectedColor === 'black' ? "border-2 border-primary" : "border border-input"
							)}
							onClick={() => setSelectedColor('black')}
						>
							{UI_TEXT.black}
						</Badge>
						<Badge 
							variant="secondary" 
							className={cn(
								"flex-1 h-12 text-base justify-center bg-white text-black hover:bg-white/90 shadow-sm cursor-pointer transition-all",
								selectedColor === 'colors' ? "border-2 border-primary" : "border border-input"
							)}
							onClick={() => setSelectedColor('colors')}
						>
							{UI_TEXT.colors}
						</Badge>
					</div>
				</div>

				{/* Row 4: Font Selection Dropdown */}
				<div className="flex flex-col gap-4 md:gap-6">
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{UI_TEXT.selectStyleLabel}
					</label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-full justify-between h-12 text-base">
								{selectedStyle || UI_TEXT.selectStylePlaceholder}
								<ChevronDown className="ml-2 h-4 w-4 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
							{FONT_STYLES.map((style) => (
								<DropdownMenuItem key={style} onClick={() => setSelectedStyle(style)}>
									{style}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Row 5: Customization Textarea */}
				<div className="flex flex-col gap-4 md:gap-6">
					<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{UI_TEXT.customizeLabel}
					</label>
					<InputGroup>
						<InputGroupTextarea
							placeholder={UI_TEXT.customizePlaceholder}
							className="min-h-[80px] max-h-[200px] overflow-y-auto resize-y"
							value={customizationInput}
							onChange={(e) => setCustomizationInput(e.target.value)}
						/>
					</InputGroup>
				</div>

				{/* Row 6: Generate Button */}
				<Button 
					className="w-full h-12 text-lg font-bold" 
					onClick={handleGenerate}
					disabled={isGenerating}
				>
					{isGenerating ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{UI_TEXT.generating}
						</>
					) : (
						UI_TEXT.generateButton
					)}
				</Button>
			</CardContent>
		</Card>

		{/* Results Grid - Outside the card for breathing room */}
		{generatedImages.length > 0 && (
			<div className="w-full max-w-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-700">
				<div className="grid grid-cols-2 gap-4">
					{generatedImages.map((imageUrl, index) => (
						<div 
							key={index} 
							className="rounded-xl overflow-hidden border bg-card shadow-sm"
						>
							<AspectRatio ratio={1}>
								<MediaModal imgSrc={imageUrl} />
							</AspectRatio>
						</div>
					))}
				</div>
			</div>
		)}
	</div>
	);
}
