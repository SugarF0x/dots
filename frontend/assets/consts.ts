export const HERO_NAMES = [
  'random',
  'abathur','alarak','alexstraza','ana','anduin','anubarak','artanis','arthas','auriel','azmodan',
  'blaze','brightwing','butcher','cassia','chen','cho','chromie','deathwing','deckard','dehaka',
  'diablo','diva','etc','falstad','fenix','gall','garrosh','gazlowe','genji','greymane',
  'guldan','hammer','hanzo','hogger','illidan','imperius','jaina','johanna','junkrat','kaelthas',
  'keltuzad','kerrigan','kharazim','leoric','lili','liming','lucio','lunara','maiev','malfurion',
  'malganis','malthael','medivh','mei','mephisto','morales','muradin','murky','nazeebo','nova',
  'orphea','probius','qhira','ragnaros','raynor','rehgar','rexxar','samuro','sonya','stitches',
  'stukov','sylvanas','tassadar','thrall','tracer','tychus','tyrael','tyrande','uther','valeera',
  'valla','varian','vikings','whitemane','xul','yrel','zagara','zarya','zeratul','zuljin'
] as const

export interface Entry extends EntryDraft {
  createdAt: Date
  updatedAt: Date
  id: "601da2d306944e4cb4f646c9"
}

export interface EntryDraft {
  name: string,
  hero: typeof HERO_NAMES[number]
  rating: number
  comment: string
}
