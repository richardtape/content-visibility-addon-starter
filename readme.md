# Content Visibility Addon Starter

This is a functioning WordPress plugin that acts as a starting point to build add-ons for [Content Visibility](https://wordpress.org/plugins/content-visibility/). This add-on adds a very simple checkbox in an "Addon Starter" control.

The code's comments aim to explain the concepts, but I hope this readme explains what needs to be
done to move from this starting point to building your own add-on.

## Prerequisites
You'll need node (v 14.5.1 or later) and npm (v 6.14.9 or later) on your local machine

## Getting this add-on to work as-is.

1. Fork this repo into your own account.
2. Clone the forked repo to your computer.
3. Move the cloned repo to your plugin's directory (normally wp-content/plugins).
4. Run `npm install` from this plugin's directory which will download all of the plugin's prerequisites.
5. Run `npm run start` from this plugin's directory which will build the plugin and get everything set up for you to be able to crete your add-on.

This add-on uses the @wordpress/scripts dependency which, besides being quite brilliant, allows us to build block editor controls. It provides scripts such as `npm run start` which builds everything in the /src/ directory (JS and CSS) as well as "watches" for changes. If you edit one of the files, the plugin will be re-built automatically and you will see tht reflected in your local environment.

Once you have performed the above 5 steps, you should be able to activate this plugin in your local environment. Make sure you have the main [Content Visibility](https://wordpress.org/plugins/content-visibility/) plugin active first, of course :)

## This add-on's files synopsis

```
├── readme.md                                    # This readme file.
├── package.json                                 # Where dependencies are kept.
├── content-visibility-addon-starter.php         # The plugin's main file.
└── src                                          #
    ├── controls                                 # Where block editor controls are kept.
    │   └── content-visibility-addon-starter.js  # Where the main component for this add-on is.
    ├── index.js                                 # The JavaScript loader file.
    └── styles                                   #
        └── editor.css                           # If you need admin styles, they're loaded from here.
└── includes                                     #
    ├── content-visibility-addon-starter.php     # PHP loader file. Also where the rule logic is kept.
```

## How Content Visibility add-ons work

Content Visibility add-ons are, at a high level, 2 things: 1 a place to add Block Editor controls such as
checkboxes, select fields, etc. to the Content Visibility section provided by the core plugin and 2) a way
to use the values from those block editor controls to determine if the block should be shown or hidden on
the current request.

The JavaScript side of things - which is where the block editor controls are created - is in the /src/ directory. The PHP side of things, where the logic is defined, is in the /includes/ directory.

### Block editor controls

`/src/controls/content-visibility-addon-starter.js` is a single file example of how to add a checkbox control to a new "Addon Starter" panel.

The Content Visibility plugin provides a React `Slot` named "content-visibility-extra-controls". Add-ons register `Fill`s that go into that `Slot`. On line 135 of `/src/controls/content-visibility-addon-starter.js` the `Fill` component is created; do not change the `name` attribute of this Fill. It is provided by the Content Visibility plugin.

You must place a component as the child of the `Fill`. It is highly likely that this component should be a WordPress `PanelBody` component. The `PanelBody` component should optionally be wrapped in a `Disabled` component which provides an extra nicety to the user experience which means that unless someone has enabled the rules AND has chosen either 'shown' or 'hidden' then add-on controls won't be something a user can interact with until they have selected both of those required options.

`PanelBody`s generally contain 1 or more `PanelRow`s which themselves contain form field controls such as checkboxes or select fields (which are likely WordPress-rpovided components such as `CheckboxControl`). If you use WordPress-provided form field components then you will have native access to the data store mechanisms they provide. In this example, we use a `CheckboxControl` which saves data on the `onChange` callback.

In this example plugin, a checkbox is provided. When a user activates content visibility rules for a block, decides whether this block should be 'Shown' or 'Hidden', and then checks the example checkbox, and updates the post, the data stored in the database looks something like this:

```
<!-- wp:paragraph {"contentVisibility":"shown","contentVisibilityRules":{"contentVisibilityRulesEnabled":true,"addonstarter":{"yourDataKey":"1"}}} -->
    <p contentvisibility="shown">This paragraph has the addon starter checkbox checked.</p>
<!-- /wp:paragraph -->
```

`addonstarter` is the name chosen as the top-level data key for this add-on. If we were to have more than one control, then data for each control would sit under the `addonstarter` key.

`yourDataKey` is the key used for this specific checkbox and, in this case, we have the checkbox checked hence having a value of 1

We can also see here that the user has chosen that this block should be `shown` when the display logic is true for the current request.

### Block display logic

Once a control is in place and saving data to the database, the remaining thing to do is to ensure that when someone views the front-end of the site, that for a block that contains content visibility logic, that we show or hide this block as necessary. We do that on the server-side, in PHP.

`/includes/content-visibility-addon-starter.php` does 2 key things.

1. Registers this add-on with the core Content Visibility plugin. It does that by adding a key and callback function to the `content_visibility_rule_types_and_callbacks` filter.
2. Provides the callback function which outlines the logic to show or hide a block that has rules associated with this add-on.

On line 65 we have set `addonstarter` as the key for this add-on. This is the same as in the JavaScript top-level data key. We also pass a full path to a callback function. In this case, the `\RichardTape\ContentVisibilityAddonStarter\rule_logic_addon_starter()` function as provided by this add-on on line 80.

The `rule_logic_addon_starter()` function is called for every block on any given post or page, and just like any Content Visibility callback function, takes 3 parameters.

`$rule_value` provides which rules have been added to this block. You should check this variable to determine if your add-on is required to do anything and bail as early as possible if not. It's an associative array with the component-specific keys for each control as the keys. i.e. in this case `$rule_value['yourDataKey']`

`$block_visibility` provides the value the user selected for this block when they decided whether it should be `shown` or `hidden`. It is a lower-case string, `shown` or `hidden`.

`$block` is the full PHP interpretation of the block currently being parsed to determine whether it should be shown or hidden.

The callback function should return a boolean value. Returning `false` will ensure that this block will be removed on the current request. Returning `true` will allow this block to be parsed by other add-ons to determine whether it should be shown or hidden.

### Styling your content visibility controls

`/src/styles/editor.css` is loaded from `/src/index.js` and the @wordpress/scripts tool builds that CSS ultimately into `/build/index.css` which is enqueued by `enqueue_editor_assets()` in `/includes/content-visibility-addon-starter.php`. You are free to load your own CSS however you like of course, but this is all built and minified for you. You are also able to use SCSS should you prefer; `import` a file ended in .scss rather than .css and the @wordpress/scripts tool should do its magic for you.