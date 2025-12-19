import { LAYOUT_STYLES } from "@/lib/layout-styles";

export default function MoronsPage() {
	return (
		<div className={LAYOUT_STYLES.pageContainer}>
			{/* Header section */}
			<div className={LAYOUT_STYLES.headerSection}>
				<h1 className={LAYOUT_STYLES.headerText}>MORONS</h1>
			</div>

			{/* Scrollable content area */}
			<div className={LAYOUT_STYLES.scrollableContent}>
				<div className={LAYOUT_STYLES.contentArea}>
					<div className="text-center">
						<p className="text-muted-foreground">
							Welcome to the Morons page.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
