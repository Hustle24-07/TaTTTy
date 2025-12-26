import { ImageUpIcon } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export const Header = () => (
	<div className="flex flex-col gap-8 sm:gap-12">
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<ImageUpIcon className="size-4" />
				<h1 className="font-semibold tracking-tight">ops.tattty.com</h1>
			</div>
			<p className="text-balance text-muted-foreground">
				TaTTTy - AI-powered image management platform with semantic search.
			</p>
			<p className="text-muted-foreground text-sm italic">
				Try searching for "water" or "desert".
			</p>
		</div>
		<div className="flex gap-2">
			<ModeToggle />
		</div>
	</div>
);
