# TacoCat Avatar Creator V2

This version upgrades the first prototype with a mobile-friendly interactive turntable based on the approved TacoCat concept sheet.

## Included

- Five-angle TacoCat viewer
- Drag/swipe rotation on mobile
- Rotation buttons
- Save current view
- TacoCat visual identity and Chapter system interface
- Placeholder customization controls for future model integration

## Important technical note

This is an interactive multi-angle turntable, not yet a true free-rotation 3D model.

The final 3D stage requires a production-ready `.glb` model containing:

- Character mesh
- UV textures and materials
- Separate glasses, outfits, and accessories
- Swappable or tintable fur and eye materials
- Correct front and back TacoCat branding

Once that model exists, it can replace the current image viewer using `<model-viewer>` or Three.js.

## Publish

Upload all files and the `assets` folder to the repository root, replacing the previous `index.html`, `styles.css`, and `script.js`.
