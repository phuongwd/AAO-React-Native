// @flow
import * as React from 'react'
import {
	type FilterType,
	FilterToolbar,
	FilterToolbarButton,
} from '@frogpond/filter'
import {Toolbar} from '@frogpond/toolbar'

type PropsType = {
	isOpen: boolean,
	title?: string,
	onPopoverDismiss: (filter: FilterType) => any,
	filters: FilterType[],
}

export function FilterNewsToolbar({
	isOpen,
	filters,
	onPopoverDismiss,
}: PropsType) {
	const categoryFilter = filters.find(f => f.type === 'picker')
	const multipleCategories =
		categoryFilter && categoryFilter.type === 'picker'
			? categoryFilter.spec.options.length > 1
			: false
	const nonPickerFilters = filters.filter(f => f.type !== 'picker')

	return (
		<React.Fragment>
			<Toolbar>
				{categoryFilter && multipleCategories ? (
					<FilterToolbarButton
						filter={categoryFilter}
						isActive={true}
						onPopoverDismiss={onPopoverDismiss}
						title={categoryFilter.spec.title}
					/>
				) : null}
			</Toolbar>
			{isOpen && (
				<FilterToolbar
					filters={nonPickerFilters}
					onPopoverDismiss={onPopoverDismiss}
				/>
			)}
		</React.Fragment>
	)
}
