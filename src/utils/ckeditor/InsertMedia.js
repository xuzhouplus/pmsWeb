import { Plugin } from 'ckeditor5/src/core';
import { createDropdown, SplitButtonView } from '@ckeditor/ckeditor5-ui';

export default class InsertMedia extends Plugin {
	splitButtonViewLabel = 'Insert media';
	splitButtonViewIcon = null;
	formView = null;
	dropdownView = null;

	getCommand() {

	}

	getFormValidators( t, registry ) {
		return [
			form => {
				if (!form.url.length) {
					return t( 'The URL must not be empty.' );
				}
			}
		];
	}

	getFormView() {

	}

	createDropdownView( locale ) {
		const t = locale.t;
		const dropdownView = createDropdown( locale, SplitButtonView );
		const splitButtonView = dropdownView.buttonView;
		const panelView = dropdownView.panelView;

		splitButtonView.set( {
			label: t( this.splitButtonViewLabel ),
			icon: this.splitButtonViewIcon,
			tooltip: true
		} );

		panelView.extendTemplate( {
			attributes: {
				class: 'ck-image-insert__panel'
			}
		} );

		return dropdownView;
	}

	setUpDropdown( dropdown, form, command ) {
		const editor = this.editor;
		const t = editor.t;
		const button = dropdown.buttonView;

		dropdown.bind( 'isEnabled' ).to( command );
		dropdown.panelView.children.add( form );

		button.set( {
			label: t( this.splitButtonViewLabel ),
			icon: this.splitButtonViewIcon,
			tooltip: true
		} );

		// Note: Use the low priority to make sure the following listener starts working after the
		// default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
		// invisible form/input cannot be focused/selected.
		button.on( 'open', () => {
			form.disableCssTransitions();

			// Make sure that each time the panel shows up, the URL field remains in sync with the value of
			// the command. If the user typed in the input, then canceled (`urlInputView#fieldView#value` stays
			// unaltered) and re-opened it without changing the value of the media command (e.g. because they
			// didn't change the selection), they would see the old value instead of the actual value of the
			// command.
			form.url = command.value || '';
			form.urlInputView.fieldView.select();
			form.focus();
			form.enableCssTransitions();
		}, { priority: 'low' } );

		dropdown.on( 'submit', () => {
			if (form.isValid()) {
				this.submit( form );
				this.closeUI();
			}
		} );

		dropdown.on( 'change:isOpen', () => form.resetFormStatus() );
		dropdown.on( 'cancel', () => {
			this.closeUI();
		} );

	}

	setUpForm( dropdown, form, command ) {
		form.delegate( 'submit', 'cancel' ).to( dropdown );
		form.urlInputView.bind( 'value' ).to( command, 'value' );

		// Form elements should be read-only when corresponding commands are disabled.
		form.urlInputView.bind( 'isReadOnly' ).to( command, 'isEnabled', value => !value );
	}

	closeUI() {
		this.editor.editing.view.focus();
		this.dropdownView.isOpen = false;
	}
}
