/**
 * Load WordPress dependencies.
 *
 * Fill           is used as add-ons register their components into a slot provided by the core Content
 *                Visibility Plugin.
 * 
 * Disabled       allows the add-ons controls to be uncontrollable by the user until the prerequisites
 *                have been set. Prereqs are to enable Content Visibility Rules and to choose shown or
 *                hidden.
 * 
 * __             is the way to internationalize text.
 * 
 * registerPlugin is used to integrate this add-on with cContent Visibility
 * addFilter      registers the key for our data
 */ 
import { Fill, Disabled } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { addFilter } from '@wordpress/hooks';

/**
 * Load this add-on's dependencies.
 *
 * PanelBody       is how all content visibility add-ons are added.
 * PanelRow        fits within PanelBody - is a place to put controls.
 * CheckboxControl is the block editor provided Checkbox input.
 */
import { PanelBody, PanelRow } from '@wordpress/components';
import { CheckboxControl } from '@wordpress/components';


/*
* For brevity, this add-ons controls are in this file, but it may be more ideal to load them
* in a separate file and import`ing them here.
*/
function ContentVisibilityAddonStarterPanelBodyControl( { props } ) {

    // Fetch the data from PHP
    const phpData = BlockVisibilityAddonStarter;

    // You may want to check your data is sent from PHP to JS correctly.
    // console.log( phpData );

    // What data has been persisted in the db?
    let persistedData = props.attributes.contentVisibilityRules;

    // This variable is merely an example. It is used to store data.
    let dataKey = 'yourDataKey';

    // If we have persisted data, and it is set to "1" then the checkbox should be checked
    // otherwise we fall back to whatever isChecked is which will change when someone alters the value of the checkbox
    let thisChecked = persistedData.hasOwnProperty( 'addonstarter' ) && persistedData.addonstarter.hasOwnProperty( dataKey ) && '1' === props.attributes.contentVisibilityRules.addonstarter[ dataKey ];

    /**
     * As it stands, this checkbox will add data to the database such as this, if the content visibility rules
     * are added to a paragraph block (truncated a little for brevity)
     * 
     *
     <!-- wp:paragraph {"contentVisibility":"shown","contentVisibilityRules":{"contentVisibilityRulesEnabled":true,"addonstarter":{"yourDataKey":"1"}}} -->
        <p contentvisibility="shown">This paragraph has the addon starter checkbox checked.</p>
     <!-- /wp:paragraph -->
     */
    return (
        <PanelBody
            title={ __( 'Addon Starter', 'content-visibility-addon-starter' ) }
            initialOpen={ false }
            className="content-visibility-control-panel content-visibility-addon-starter-controls"
        >
            <PanelRow>
                <CheckboxControl
                    label='Example Label'
                    checked={ thisChecked }
                    onChange={ ( isChecked ) => {
                        props.setAttributes( {
                            contentVisibilityRules: {
                                ...props.attributes.contentVisibilityRules,
                                addonstarter: {
                                    ...props.attributes.contentVisibilityRules.addonstarter,
                                    [dataKey]: isChecked ? '1' : '0'
                                }
                            },
                        } );
                    }}
                />

                { props.attributes.contentVisibility && (
                    <p className="addon-starter-help-intro content-visibility-help-text">{ __( 'Try changing the Shown or Hidden field and watch this text update. When this checkbox is checked, this block will be ' + props.attributes.contentVisibility + '.', 'content-visibility-addon-starter' ) }</p>
                ) }
            </PanelRow>

        </PanelBody>
    );

}//end ContentVisibilityAddonStarterPanelBodyControl()


/**
 * The component that is exported and loaded and what is displayed to the user.
 * This should be a PanelBodyControl component which contains your controls.
 * @param {object} data The block data 
 */
export function ContentVisibilityAddonStarterControl( data ) {

    let { props } = { ...data };

    // Does this block have rules enabled and have we selected shown or hidden?
    let rulesEnabled      = props.attributes.contentVisibilityRules.contentVisibilityRulesEnabled;
    let contentVisibility = props.attributes.hasOwnProperty( 'contentVisibility' );

    // Both need to be set, if not, the controls for this add-on should be disabled.
    // This is done by wrapping our controls in a <Disabled> component.
    if ( ! rulesEnabled || ! contentVisibility ) {
        return (
            <Disabled><ContentVisibilityAddonStarterPanelBodyControl props={ props } /></Disabled>
        );
    }

    // This block has rules enabled and the user has selected 'shown' or 'hidden'. Load our controls.
    return (
        <ContentVisibilityAddonStarterPanelBodyControl props={ props } />
    );

}//end ContentVisibilityAddonStarterControl()

/**
 * Render the <ContentVisibilityAddonStarterControl> component by adding
 * it to the block-visibility-extra-controls Fill.
 *
 * @return {Object} A Fill component wrapping the ContentVisibilityAddonStarterControl component.
 */
function ContentVisibilityAddonStarterFill() {

    // Do not change the name attribute of this Fill. It is the name provided by the Content Visibility plugin.
    return (
        <Fill name="content-visibility-extra-controls">
            {
                ( fillProps ) => {
                    return (
                        <ContentVisibilityAddonStarterControl props={ fillProps } />
                    )
                }
            }
        </Fill>
    );

}//end ContentVisibilityAddonStarterFill()

// Add our component to the Slot provided by BlockVisibilityControls
// The integer is an attempt to control the order of display of add-ons in the block sidebar. Higher = lower.
registerPlugin( 'content-visibility-99-addon-starter-fill', { render: ContentVisibilityAddonStarterFill } );


// Register our visibility rule with the main plugin
addFilter( 'contentVisibility.defaultContentVisibilityRules', 'content-visibility-addon-starter/block-visibility-rules', registerContentVisibilityRule );

/**
 * Register our data key so that controls for this add-on have a place to store their data.
 * @param {*} defaultRules 
 */
function registerContentVisibilityRule( defaultRules ) {

    defaultRules.addonstarter = {};

    return defaultRules;

}//end registerContentVisibilityRule()
