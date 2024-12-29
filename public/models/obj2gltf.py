import sys
import os
# Requires Blender, invoke as `blender --python obj2gltf.py -- <out_file> <in_file> [texture_file]`
import bpy

start = sys.argv.index('--') + 1
out_filepath = sys.argv[start]
in_filepath = sys.argv[start + 1]
image_filepath = None
if len(sys.argv) > start + 1:
    image_filepath = sys.argv[start + 2]

context = bpy.context
scene = context.scene

for c in scene.collection.children:
    scene.collection.children.unlink(c)


bpy.ops.wm.obj_import(filepath=in_filepath)
""" """
if image_filepath is not None:
    model_name = os.path.splitext(os.path.basename(in_filepath))[0]
    texture_name = os.path.basename(image_filepath)
    bpy.ops.image.open(filepath=image_filepath)
    tex = bpy.data.images[texture_name]

    material = bpy.data.materials.new(name=texture_name)
    material.use_nodes = True
    #create a reference to the material output
    material_output = material.node_tree.nodes.get('Material Output')
    principled_BSDF = material.node_tree.nodes.get('Principled BSDF')

    texImage_node = material.node_tree.nodes.new('ShaderNodeTexImage')
    texImage_node.image = tex
    #set location of node
    material_output.location = (400, 20)
    principled_BSDF.location = (0, 0)
    texImage_node.location = (-400, -500)

    material.node_tree.links.new(texImage_node.outputs[0], principled_BSDF.inputs[0])
    #material.node_tree.nodes["Principled BSDF"].inputs['Specular'].default_value = 0
    material.node_tree.nodes["Principled BSDF"].inputs['Roughness'].default_value = 0.5
    mat = bpy.data.materials.get(texture_name)
    mat.blend_method = 'CLIP'

    obj = bpy.data.objects[model_name]
    obj.data.materials.append(mat)

bpy.ops.export_scene.gltf(filepath=out_filepath, export_format='GLB')
bpy.ops.export_scene.gltf(filepath=out_filepath, export_format='GLTF_SEPARATE')
