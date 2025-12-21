"use client";

import { FontForgeCard } from "@/components/font-forge-card";
import { LAYOUT_STYLES } from "@/lib/layout-styles";

export default function FontsPage() {
	return (
		<div className={LAYOUT_STYLES.pageContainer}>
			{/* Scrollable content area */}
			<div className={LAYOUT_STYLES.scrollableContent}>
				<div className={LAYOUT_STYLES.contentArea}>
					<FontForgeCard />
				</div>
			</div>
		</div>
	);
}
