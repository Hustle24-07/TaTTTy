import {Virtualizer, WaterfallLayout, Text} from 'react-aria-components';
import {GridList, GridListItem} from './GridList';

let images = [
    {
        "id": "8SXaMMWCTGc",
        "title": "A Ficus Lyrata Leaf in the sunlight (2/2) (IG: @clay.banks)",
        "user": "Clay Banks",
        "image": "https://images.unsplash.com/photo-1580133318324-f2f76d987dd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666"
    },
    {
        "id": "pYjCqqDEOFo",
        "title": "beach of Italy",
        "user": "alan bajura",
        "image": "https://images.unsplash.com/photo-1737100522891-e8946ac97fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "CF-2tl6MQj0",
        "title": "A winding road in the middle of a forest",
        "user": "Artem Stoliar",
        "image": "https://images.unsplash.com/photo-1738249034651-1896f689be58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.3333333333333333"
    },
    {
        "id": "OW97sLU0cOw",
        "title": "A green and purple aurora over a snow covered forest",
        "user": "Janosch Diggelmann",
        "image": "https://images.unsplash.com/photo-1738189669835-61808a9d5981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6669921875"
    },
    {
        "id": "WfeLZ02IhkM",
        "title": "A blue and white firework is seen from above",
        "user": "Janosch Diggelmann",
        "image": "https://images.unsplash.com/photo-1738168601630-1c1f3ef5a95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.3353596757852078"
    },
    {
        "id": "w1GpST72Bg8",
        "title": "A snow covered mountain with a sky background",
        "user": "Daniil Silantev",
        "image": "https://images.unsplash.com/photo-1738165170747-ecc6e3a4d97c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.4978580171358629"
    },
    {
        "id": "0iN0KIt6lYI",
        "title": "\"Pastel Sunset\"",
        "user": "Marek Piwnicki",
        "image": "https://images.unsplash.com/photo-1737917818689-f3b3708de5d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6249763481551561"
    },
    {
        "id": "-mFKPfXXUG0",
        "title": "Leave the weight behind! You must make yourself light to strive upwards — to reach the light. (A serene winter landscape featuring a dense collection of bare, white trees.)",
        "user": "Simon Berger",
        "image": "https://images.unsplash.com/photo-1737972970322-cc2e255021bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1"
    },
    {
        "id": "MOk6URQ28R4",
        "title": "A snow covered tree with a sky background",
        "user": "Daniil Silantev",
        "image": "https://images.unsplash.com/photo-1738081359113-a7a33c509cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.666598611678236"
    },
    {
        "id": "y36Nj_edtRE",
        "title": "A lake surrounded by trees covered in snow",
        "user": "Daniel Seßler",
        "image": "https://images.unsplash.com/photo-1736018545810-3de4c7ec25fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.667"
    },
    {
        "id": "NvBV-YwlgBw",
        "title": "The night sky with stars above a rock formation",
        "user": "Dennis Haug",
        "image": "https://images.unsplash.com/photo-1735528655501-cf671a3323c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1"
    },
    {
        "id": "UthQdrPFxt0",
        "title": "A pine tree covered in snow in a forest",
        "user": "Anita Austvika",
        "image": "https://images.unsplash.com/photo-1737312905026-5dfdff1097bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "2k74xaf8dfc",
        "title": "The sun shines through the trees in the forest",
        "user": "Joyce G",
        "image": "https://images.unsplash.com/photo-1736185597807-371cae1c7e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "Yje5kgfvCm0",
        "title": "A blurry photo of a field of flowers",
        "user": "Eugene Golovesov",
        "image": "https://images.unsplash.com/photo-1736483065204-e55e62092780?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6661569826707442"
    },
    {
        "id": "G2bsj2LVttI",
        "title": "A foggy road lined with trees and grass",
        "user": "Ingmar H",
        "image": "https://images.unsplash.com/photo-1737903071772-4d20348b4d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.7499509707785841"
    },
    {
        "id": "ppyNBOkfiuY",
        "title": "A close up of a green palm tree",
        "user": "Junel Mujar",
        "image": "https://images.unsplash.com/photo-1736849544918-6ddb5cfc2c42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.7507507507507507"
    },
    {
        "id": "UcWUMqIsld8",
        "title": "A green leaf floating on top of a body of water",
        "user": "Allec Gomes",
        "image": "https://images.unsplash.com/photo-1737559217439-a5703e9b65cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "xHqOVq9w8OI",
        "title": "green-leafed plant",
        "user": "Joshua Michaels",
        "image": "https://images.unsplash.com/photo-1563364664-399838d1394c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.504"
    },
    {
        "id": "uWx3_XEc-Jw",
        "title": "A view of a mountain covered in fog",
        "user": "iuliu illes",
        "image": "https://images.unsplash.com/photo-1737403428945-c584529b7b17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.3430962343096233"
    },
    {
        "id": "2_3lhGt8i-Y",
        "title": "A field with tall grass and fog in the background",
        "user": "Ingmar H",
        "image": "https://images.unsplash.com/photo-1737439987404-a3ee9fb95351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "FV-__IOxb08",
        "title": "A close up of a wave on a sandy beach",
        "user": "Jonathan Borba",
        "image": "https://images.unsplash.com/photo-1726502102472-2108ef2a5cae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "_BS-vK3boOU",
        "title": "Desert textures",
        "user": "Braden Jarvis",
        "image": "https://images.unsplash.com/photo-1722359546494-8e3a00f88e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.7135258358662614"
    },
    {
        "id": "LjAcS9lJdBg",
        "title": "Tew Falls, waterfall, in Hamilton, Canada.",
        "user": "Andre Portolesi",
        "image": "https://images.unsplash.com/photo-1705021246536-aecfad654893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.8"
    },
    {
        "id": "hlj6xJG30FE",
        "title": "Find me on Instagram! @intricateexplorer",
        "user": "Intricate Explorer",
        "image": "https://images.unsplash.com/photo-1631641551473-fbe46919289d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.4992510164776376"
    },
    {
        "id": "vMoZvKeZOhw",
        "title": "Salt Marshes, Isle of Harris, Scotland by Nils Leonhardt. Visit my website: https://nilsleonhardt.com/storytelling-harris/ Instagram: @am.basteir",
        "user": "Nils Leonhardt",
        "image": "https://images.unsplash.com/photo-1585951301678-8fd6f3b32c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "wCLCK9LDDjI",
        "title": "An aerial view of a snow covered forest",
        "user": "Lukas Hädrich",
        "image": "https://images.unsplash.com/photo-1737405555489-78b3755eaa81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.5"
    },
    {
        "id": "OdDx3_NB-Wk",
        "title": "A close up of a tall grass with a sky in the background",
        "user": "Ingmar H",
        "image": "https://images.unsplash.com/photo-1737301519296-062cd324dbfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "Gn-FOw1geFc",
        "title": "Larches on Maple Pass, Washington",
        "user": "noelle",
        "image": "https://images.unsplash.com/photo-1737496538329-a59d10148a08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    },
    {
        "id": "VhKJHOz2tJ8",
        "title": "IC 1805 La nébuleuse du coeur",
        "user": "arnaud girault",
        "image": "https://images.unsplash.com/photo-1737478598284-b9bc11cb1e9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "1.504158004158004"
    },
    {
        "id": "w5QmH_uqB0U",
        "title": "A pile of shells sitting on top of a sandy beach",
        "user": "Toa Heftiba",
        "image": "https://images.unsplash.com/photo-1725366351350-a64a1be919ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNDA4NDh8MHwxfHRvcGljfHw2c01WalRMU2tlUXx8fHx8Mnx8MTczODM2NzE4M3w&ixlib=rb-4.0.3&q=80&w=400",
        "aspectRatio": "0.6666666666666666"
    }
];

for (let i = 0; images.length < 500; i++) {
  images.push({...images[i % 30], id: String(i)});
}

<Virtualizer
  layout={WaterfallLayout}
  layoutOptions={{
    minItemSize: new Size(150, 200), 
    minSpace: new Size(8, 8), 
    maxColumns: Infinity
  }}
>
  <GridList
    layout="grid"
    aria-label="Virtualized waterfall layout"
    selectionMode="multiple"
    items={images}
    data-size="small"
    style={{display: 'block', padding: 0, height: 400, width: '100%'}}>
    {item => (
      <GridListItem textValue={item.title}>
        <img src={item.image} alt="" style={{aspectRatio: item.aspectRatio, maxWidth: 'none'}} />
        <Text>{item.title}</Text>
        <Text slot="description">{item.user}</Text>
      </GridListItem>
    )}
  </GridList>
</Virtualizer>
