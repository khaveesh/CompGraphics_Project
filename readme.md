Objectives:

-   Procedural animation of a scene
-   Modeling a dynamic scene with a Scene Graph and relative transforms,
    and enabling animation through the scene graph
-   Generating texture mappings for objects of different shapes.
-   Managing lights and camera
-   Handling collisions
-   Basics of a VR application

## Scene and animation

A set of objects are moving as one or more groups in a defined path. You
join the scene as a VR avatar. You can choose any shape for your avatar.
You should be able move around anywhere in the scene (simple turn left
or right and move/stop controls)

-   Each group has a leader, and the others follow such that each object
    follows only one other object in the group. E.g. the coaches of a
    train, a convoy of trucks, a line of ants, a flight of birds etc.
    The leader decides the actual path of motion, and the others adjust
    accordingly.

-   The path has both static and dynamic obstacles. When the leader
    comes close to an obstacle, it changes its path to avoid and move
    past the obstacle without colliding with the obstacle(s). Think of a
    road with potholes/rocks and vehicles that suddenly appear in your
    path. Note that the avatar can also be an obstacle to the other
    scene objects and vice versa

-   Your avatar can attach itself to one of the moving
    objects(E.g.sitting on one of the trucks). In addition, the avatar
    can also jump up and down or turn around while moving along with the
    object.

## Appearance and Textures

All the objects in the scene, including the ground, are rendered using
textures. Use any reasonable texture images. Please use texture images
that will show the correctness of the texture maps. Thus, use images
such as photos of people/animals/natural scenes, world maps, etc, and
avoid featureless textures like sand, wood, brick, fur etc. Use at least
3 distinct texture images across objects in the scene

-   Based on user control, the textures of objects can be changed. That
    is, the image associated as the texture for an object can be changed
    on user input. You can use either the default texture coordinates
    for the object (if it exists) or a simple planar map

-   User controls enable switching to cylindrical maps for some subset
    of objects

-   User controls enable switching to spherical maps for some subset of
    objects

## Lighting

The scene is illuminated by multiple lights. The user should be able to
switch any of these sets of lights off or on. Adjust the intensity of
the lights so that all the effects are clearly perceptible.

-   One set of lights is fixed to the ground, and each light illuminates
    a small region around it (e.g. streetlights).

-   Another light is at a fixed location, but tracks one of the moving
    objects (e.g. a searchlight).

-   Another light third is attached to one of the moving objects (e.g. a
    car headlight or a flashlight in a person's hand).

## Camera

The scene is observed by 3 cameras:

-   One camera is at a fixed position observing the whole scene. This is
    the default view.

-   An overhead camera is mounted on a drone, with the camera facing
    forward and down. The user flies the drone, by adjusting its height
    (move up or down), turning it (left or right) and adjusting its
    speed.

-   Another camera is attached to your avatar and simulates the avatar's
    view of the scene.

Setup dependencies: `npm install`

Start server: `npm run dev`
