import { Editor, MarkdownView, Notice, Plugin } from "obsidian";

/**
 * Calculates from a number between 0..1 representing the percentage of right answers the resulting grade.
 * Based on https://www.ief.uni-rostock.de/storages/uni-rostock/Alle_IEF/IEF/Ordnungen/RPO/RPO_BSc_MSc_2023_-_UNI_HRO_-_Amtliche_Bekanntmachungen_-_NR_5_2023.pdf
 * page 17.
 */
function percentToGrade(percent: number): number {
	const minPercent = 0.6;
	const aboveMin = 1 - minPercent;

	// Maps each grade to the required percentage of points archived above the minimum.
	const gradeMap = [
		// E.g., for 1.0 one has to archive at least 85% of the points above the minimum score.
		[1.0, 0.85],
		[1.3, 0.75],
		[1.7, 0.67],
		[2.0, 0.59],
		[2.3, 0.5],
		[2.7, 0.42],
		[3.0, 0.34],
		[3.3, 0.25],
		[3.7, 0.12],
		[4.0, 0],
	];

	for (const [grade, percentAboveMin] of gradeMap) {
		if (percent >= minPercent + percentAboveMin * aboveMin) {
			return grade;
		}
	}

	return 5.0;
}

export default class OralExamProtocolHelperPlugin extends Plugin {
	async onload() {
		const plusMinuxRegex = /[\+-]/g;
		const ulLineStart = /^[-*+] (.*)/;

		this.addCommand({
			id: "calculate-points-and-grade",
			name: "Calculate points and a grade",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const noteFile = this.app.workspace.getActiveFile();
				if (!noteFile) {
					new Notice("Please open a oral exam protocol.");
					return;
				}

				// Iterate over each line, skipping frontmatter, count + and -
				// for each unordered list item. The points for each line is
				// the proportion of + signs against - signs in that line.
				// Therefore per line the point has a range of [0, 1].

				let maxPoints = 0;
				let points = 0;
				let inFrontmatter = false;
				for (let i = 0; i < editor.lineCount(); i++) {
					const line = editor.getLine(i).trim();
					// Skip empty lines.
					if (line === "") {
						continue;
					}

					// Handle frontmatter start and end. This is very
					// rudementary but for this plugin just assume there is no
					// invalid second frontmatter block. If it is, its content
					// will just as well be ignored.
					if (line === "---") {
						inFrontmatter = !inFrontmatter;
						continue;
					}

					// Ignore frontmatter.
					if (inFrontmatter) {
						continue;
					}

					const lineMatch = line.match(ulLineStart);
					if (!lineMatch) {
						// Line is not an unordered list item.
						continue;
					}

					const lineContent = lineMatch[1];

					const match = lineContent.match(plusMinuxRegex);
					if (!match) {
						// Lines does not contain + or - so ignore the line.
						continue;
					}

					maxPoints += 1;
					const linePoints = match.reduce(
						(prev, curr) =>
							curr === "+" ? prev + 1 / match.length : prev,
						0
					);
					points += linePoints;
				}

				// Update the documents frontmatter with the calculated values.
				this.app.fileManager.processFrontMatter(
					noteFile,
					(frontmatter) => {
						frontmatter.punkte = `${points.toFixed(
							2
						)}/${maxPoints}`;
						frontmatter.vorgeschlageneNote = percentToGrade(
							points / maxPoints
						);
					}
				);
			},
		});
	}

	onunload() {}
}
