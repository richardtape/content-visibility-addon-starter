<?php
/**
 * Content Visibility Addon Starter
 *
 * @package     ContentVisibilityAddonStarter
 * @author      Rich Tape
 * @copyright   2021 Rich Tape
 * @license     GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: Content Visibility Addon Starter
 * Plugin URI:  https://richardtape.com/content-visibility/
 * Description: [Content Visibility Add-On] Addon Starter.
 * Version:     0.1.1
 * Author:      Rich Tape
 * Author URI:  https://richardtape.com
 * Text Domain: content-visibility-addon-starter
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/content-visibility-addon-starter.php';
