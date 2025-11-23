
import { Scene } from '../types';

// 辅助常量：用于控制节奏的换行
const BR = '\n\n';

export const STORY: Record<string, Scene> = {
  // ---------------------------------------------------------
  // 第一章：至暗时刻（苏醒与困局）
  // ---------------------------------------------------------
  'start': {
    id: 'start',
    title: '序章：第七日',
    text: `滴答……滴答……${BR}粘稠的液体砸在额头，冰冷得像死人的指尖。那声音在死寂的颅骨内无限放大，每一次撞击都伴随着一阵钝痛。${BR}你试图吸气，肺叶却像被灌满了水泥。鼻腔里充斥着一股令人作呕的复合气味——陈年霉斑的酸腐、烧焦胶皮的刺鼻，以及最底层那股……淡淡的、却极具穿透力的福尔马林味。${BR}“……还没醒吗？吉时……快过了……”${BR}耳边似乎有人在窃窃私语，声音像是老式收音机调频失败时的白噪音，细密、尖锐，带着某种恶毒的期待。${BR}你猛地睁开眼，视网膜上还残留着上一秒梦境中的血色残像。心脏剧烈撞击着胸腔，仿佛要为了逃离这具躯壳而跳出来。`,
    choices: [
      { id: 'c1', text: '检查身体状况', nextSceneId: 'body_check', type: 'investigate' },
      { id: 'c2', text: '观察这间诡异的屋子', nextSceneId: 'room_environment', sanityCost: 5, type: 'normal' },
    ],
    backgroundStyle: 'bg-stone-950',
    visualEffect: 'flicker',
    soundCue: '[ 听觉：老式挂钟沉闷的走针声，却忽快忽慢 ]',
  },
  'body_check': {
    id: 'body_check',
    title: '陌生的躯壳',
    text: `你低头看向自己的手。${BR}那是一双苍白、消瘦的手，指甲缝里塞满了黑色的泥垢，像是刚徒手挖过坟墓。${BR}你摸向胸口，工装口袋里有一张硬质卡片和半包受潮的香烟。${BR}借着微弱的光线，你看清了卡片——那是一张黑白遗照。照片上的人面无表情，眼神空洞地注视着前方，嘴角似乎挂着一丝若有若无的嘲弄。${BR}那是你。${BR}但照片背面的字迹让你脊背发凉，那是用红笔力透纸背写下的狂草：${BR}“别信镜子。别接电话。别回头。”`,
    choices: [
      { id: 'c_panic', text: '收起遗照', nextSceneId: 'room_environment', sanityCost: 5, type: 'normal' },
    ],
    visualEffect: 'glitch',
    soundCue: '[ 状态：理智 -5 ]',
  },
  'room_environment': {
    id: 'room_environment',
    title: '303室：囚笼',
    text: `你身处一间典型的90年代筒子楼单间，空间逼仄得像一口棺材。${BR}墙皮大块剥落，露出里面发黑的红砖，宛如干涸已久的伤口。头顶那盏昏黄的钨丝灯泡因为电压不稳而疯狂闪烁，将你的影子拉扯得扭曲变形。${BR}房间里除了那张散发着霉味的铁架床，只有三处值得注意的地方：${BR}靠窗的一张老式书桌，上面堆满了废纸；${BR}角落里立着的一口朱红色的漆木柜子，红得像刚刷了一层血；${BR}以及那扇紧闭的、通往外界的木门。${BR}窗外透进来的光是不正常的暗红色，像是一只巨大的充血眼球贴在玻璃上窥视。`,
    choices: [
      { id: 'c_desk', text: '检查书桌上的笔记', nextSceneId: 'desk_check', type: 'investigate', hideIfFlag: 'diary_read' },
      { id: 'c_cabinet', text: '走向那个红柜子', nextSceneId: 'cabinet_approach', type: 'investigate' },
      { id: 'c_door', text: '靠近房门', nextSceneId: 'door_approach', type: 'normal' },
    ],
  },
  'desk_check': {
    id: 'desk_check',
    title: '疯子的日记',
    text: `桌上乱得像个垃圾堆。你翻开一本封皮发霉的日记本，纸张湿哒哒的，字迹潦草混乱。${BR}“7月14日：它进来了。它不是我老婆。”${BR}“7月15日：镜子里的人比我慢半拍。我看到了，它在笑。”${BR}“7月17日：所有的门都被封死了。只有‘生门’能走，但我忘了哪扇是生门……”${BR}日记的最后几页被疯狂的涂鸦覆盖，全是黑色的圆圈，像是一只只眼睛。${BR}在日记本下面，你发现了一把生锈的剪刀。`,
    choices: [
      { id: 'c_take_scissors', text: '拿走剪刀', nextSceneId: 'room_environment', getItem: '剪刀', type: 'normal', effect: (state) => ({ ...state, flags: { ...state.flags, diary_read: true } }) },
      { id: 'c_ignore_scissors', text: '放下日记', nextSceneId: 'room_environment', type: 'normal', effect: (state) => ({ ...state, flags: { ...state.flags, diary_read: true } }) },
    ],
    soundCue: '[ 获得物品：剪刀 ]',
  },
  'cabinet_approach': {
    id: 'cabinet_approach',
    title: '红漆木柜',
    text: `这是一口老式的嫁妆柜，朱红色的漆面已经斑驳，露出底下的黑色木纹，像是一张溃烂流脓的脸。${BR}当你靠近时，你能闻到一股浓烈的樟脑丸味道，试图掩盖底下的……腐烂味。${BR}柜门半掩着，黑暗的缝隙中似乎有什么东西在反光。${BR}兹拉……兹拉……${BR}柜子内部传来了指甲抓挠木板的声音，缓慢，无力，却极其执着。它想出来。`,
    choices: [
      { id: 'c_open_cabinet', text: '猛地拉开柜门', nextSceneId: 'cabinet_open', sanityCost: 5, type: 'danger' },
      { id: 'c_leave_cabinet', text: '太危险了，退后', nextSceneId: 'room_environment', type: 'normal' },
    ],
  },
  'cabinet_open': {
    id: 'cabinet_open',
    title: '镜中煞',
    text: `柜门发出老妇人尖叫般的摩擦声被拉开。${BR}里面并没有什么怪物，只有一面碎了一角的穿衣镜，斜靠在柜壁上。镜子旁边放着一个金属打火机，那是你父亲生前的遗物。${BR}你下意识看向镜子，镜面映出了你惊恐苍白的脸。${BR}等等。${BR}一种巨大的违和感击中了你。你现在正瞪大眼睛，呼吸急促。${BR}但镜子里的那个“你”，眼神平静如水，嘴角甚至还在微微上扬。${BR}它在观察你。就像观察一只困在玻璃瓶里的苍蝇。`,
    choices: [
      { id: 'c_smash_mirror', text: '用剪刀刺向镜子！', nextSceneId: 'mirror_break', requiredItem: '剪刀', type: 'danger', sanityCost: 10 },
      { id: 'c_grab_run', text: '抓起打火机就跑', nextSceneId: 'get_lighter', getItem: '打火机', sanityCost: 15, type: 'normal' },
      { id: 'c_stare', text: '与它对视', nextSceneId: 'mirror_death', type: 'danger' },
    ],
    visualEffect: 'shake',
    soundCue: '[ 警告：观察者效应 ]',
  },
  'mirror_break': {
    id: 'mirror_break',
    title: '破碎',
    text: `“去死吧！”${BR}你怒吼一声，手中的剪刀狠狠扎向镜面。${BR}“咔嚓！”${BR}镜子碎裂的瞬间，你听到了一声凄厉的惨叫——那声音竟然是从你自己喉咙里发出来的！${BR}镜子里的影像碎裂成无数片，每一片碎片里的眼睛都在流血。${BR}一股黑烟从裂缝中钻出，消散在空气中。你趁机抓起了旁边的打火机。${BR}虽然手在发抖，但你感到一种莫名的快意。你打破了规则。`,
    choices: [
      { id: 'c_check_door', text: '去门口查看', nextSceneId: 'door_approach', getItem: '打火机', type: 'normal' },
    ],
    soundCue: '[ 获得物品：打火机 ]',
  },
  'mirror_death': {
    id: 'mirror_death',
    title: '坏结局：取代',
    text: `你被那诡异的笑容吸引，仿佛灵魂被钩子钩住，无法移开视线。${BR}“找到你了。”${BR}镜子里的“你”嘴唇开合，却发出了你父亲的声音。${BR}它缓缓伸出手，掌心贴在了镜面上。你也鬼使神差地伸出手，贴了上去。${BR}指尖触碰的瞬间，没有玻璃的冰凉，只有一股巨大的吸力！${BR}你被硬生生拽进了镜子里，世界天旋地转。${BR}最后的视野，是你看到“自己”正站在柜子前，整理了一下衣领，捡起打火机，冷笑着转身离开。${BR}“这次……轮到我出去了。”`,
    choices: [
      { id: 'c_restart', text: '重新开始', nextSceneId: 'start', type: 'end' }
    ],
    endingType: 'bad',
    visualEffect: 'glitch'
  },
  'get_lighter': {
    id: 'get_lighter',
    title: '父亲的打火机',
    text: `你一把抓起打火机，连滚带爬地后退，撞翻了身后的脸盆架。${BR}镜子里的影子似乎因为你的逃离而变得扭曲愤怒，它猛地撞击着镜面，发出“砰砰”的闷响。${BR}你不敢回头，死死握着打火机。黄铜外壳上刻着“赠 吾儿”。${BR}掌心传来一丝微弱的温度，这是你在这个冰冷地狱里唯一的慰藉。${BR}就在这时，门外的走廊里突然响起了电话铃声。`,
    choices: [
      { id: 'c_door_check', text: '去门口查看', nextSceneId: 'door_approach', type: 'normal' },
    ],
  },
  'door_approach': {
    id: 'door_approach',
    title: '门外的呼唤',
    text: `“叮铃铃——叮铃铃——”${BR}刺耳的老式电话铃声在死寂的楼道里回荡，每一声都像是催命的符咒，尖锐地钻进你的耳膜。${BR}你凑近门上的猫眼。${BR}视野一片血红。${BR}走廊里的灯忽明忽暗，电流声滋滋作响。你隐约看到一个模糊的人影正站在那部红色的公用电话前。${BR}它背对着你，穿着一件湿透的雨衣，水滴不断地滴在地板上。${BR}它一动不动，似乎在等待你去接听。`,
    choices: [
      { id: 'c_open_door', text: '开门出去', nextSceneId: 'hallway_start', sanityCost: 5, type: 'danger' },
      { id: 'c_wait', text: '屏息等待', nextSceneId: 'door_wait', type: 'normal' },
    ],
  },
  'door_wait': {
    id: 'door_wait',
    title: '破门',
    text: `你死死捂住口鼻，不敢发出一点声音。${BR}铃声响了很久，终于停了。${BR}死寂重新笼罩了走廊。那个人影缓缓转过身——雨衣的帽子下，是一片漆黑的虚无。${BR}它没有脸。${BR}它一步步朝你的房门走来，脚步声湿漉漉的，像是一块吸饱水的海绵用力拍在地上。${BR}啪嗒。啪嗒。${BR}声音停在了你的门口。门把手开始剧烈转动！${BR}“该上路了……”`,
    choices: [
      { id: 'c_panic_open', text: '在它闯入前冲出去！', nextSceneId: 'hallway_start', sanityCost: 15, type: 'danger' },
    ],
    soundCue: '[ 听觉：门板不堪重负的吱呀声 ]',
    visualEffect: 'shake',
  },

  // ---------------------------------------------------------
  // 第二章：迷楼（扩展版）
  // ---------------------------------------------------------
  'hallway_start': {
    id: 'hallway_start',
    title: '第二章：回形楼道',
    text: `你冲进走廊，空气中弥漫着浓烈的铁锈味和烧焦的纸灰味。${BR}这里是三楼。两侧的房门紧闭，门上贴满了褪色的“福”字——全部是倒着贴的，红得刺眼，不像是在祈福，倒像是在镇压着屋里的什么东西。${BR}那部红色的公用电话就挂在左手边的墙上，听筒垂在半空，像吊死之人的舌头一样晃荡。${BR}雨衣人不见了，只留下一滩水渍。${BR}你的右手边是公用厨房，里面传出剁肉的声音。左手边是302室，门缝里塞满了诡异的符纸。`,
    choices: [
      { id: 'c_phone', text: '接听电话', nextSceneId: 'phone_call', type: 'investigate', hideIfItem: '古铜钱' },
      { id: 'c_kitchen', text: '进入公用厨房', nextSceneId: 'kitchen_enter', type: 'investigate' },
      { id: 'c_302', text: '敲302的门', nextSceneId: 'room_302_knock', type: 'normal' },
      { id: 'c_washroom', text: '去走廊尽头的盥洗室', nextSceneId: 'washroom_enter', type: 'normal' },
    ],
    backgroundStyle: 'bg-red-950/20',
  },
  'phone_call': {
    id: 'phone_call',
    title: '午夜凶铃',
    text: `你颤抖着拿起听筒，贴在耳边。${BR}预想中的鬼哭狼嚎并没有出现。${BR}听筒里传来的是极其嘈杂、却又极其真实的仪器滴滴声——那是医院心电监护仪的声音。${BR}“……303床的家属！在哪里！？”${BR}“病人瞳孔扩散了！除颤仪充电！”${BR}一个女人的哭声撕心裂肺，穿透了维度的阻隔：“求求你们……救救我的孩子……我不该让他回那栋楼的……”${BR}那声音无比熟悉，那是母亲的声音。你在听你自己的抢救现场。${BR}咔哒，电话挂断了。退币口滚出一枚生锈的古铜钱。`,
    choices: [
      { id: 'c_coin', text: '捡起古铜钱', nextSceneId: 'hallway_start', getItem: '古铜钱', sanityCost: 5, type: 'normal' },
    ],
    visualEffect: 'glitch',
    soundCue: '[ 线索：你正处于生死边缘 ]',
  },
  'kitchen_enter': {
    id: 'kitchen_enter',
    title: '公用厨房',
    text: `厨房里油烟味重得让人窒息，墙壁上积着厚厚的黑油。${BR}一个煤球炉子上正炖着一只黑漆漆的砂锅，咕嘟咕嘟冒着泡。剁肉声消失了，但案板上放着一把带血的菜刀。${BR}奇怪的是，砂锅下并没有火，但它却在沸腾。${BR}旁边的架子上放着一个破碗，碗里盛满了白色的晶体。`,
    choices: [
      { id: 'c_pot', text: '掀开砂锅盖子', nextSceneId: 'kitchen_pot', sanityCost: 5, type: 'danger' },
      { id: 'c_salt', text: '检查那碗晶体', nextSceneId: 'kitchen_salt', type: 'investigate' },
      { id: 'c_leave_kitchen', text: '离开厨房', nextSceneId: 'hallway_start', type: 'normal' },
    ],
  },
  'kitchen_pot': {
    id: 'kitchen_pot',
    title: '一锅“肉”汤',
    text: `你忍着恶心掀开盖子。${BR}热气散去，你看到浑浊的汤水里翻滚着一些东西。${BR}那不是肉，而是几只死老鼠，还有……几根手指。${BR}汤面上漂浮着一张照片，已经泡得发白，但依稀能看出是一张全家福。${BR}你感到胃部一阵痉挛，强烈的呕吐感涌上喉咙。`,
    choices: [
      { id: 'c_vomit', text: '盖上盖子后退', nextSceneId: 'kitchen_enter', sanityCost: 10, type: 'normal' },
    ],
  },
  'kitchen_salt': {
    id: 'kitchen_salt',
    title: '祭祀粗盐',
    text: `你捻起一点晶体闻了闻，没有味道。放在舌尖尝了一下，极咸。${BR}这是粗盐。${BR}在民间习俗中，盐能驱邪，也能固煞。${BR}这碗盐放在这里，显然是为了某种目的。你觉得它可能会有用。`,
    choices: [
      { id: 'c_take_salt', text: '抓一把粗盐带走', nextSceneId: 'kitchen_enter', getItem: '粗盐', type: 'normal' },
    ],
  },
  'room_302_knock': {
    id: 'room_302_knock',
    title: '302：观察者',
    text: `你试着敲了敲302的门。${BR}“咚、咚、咚。”${BR}门并没有开，但里面传出了窸窸窣窣的声音，紧接着，门上的猫眼突然变黑了——里面的人也在往外看。${BR}一个沙哑的声音贴着门板传来：“你又回来了？这是第几次了？第四次？还是第五次？”${BR}“别费劲了。出不去的。除非你能把他们都送走。”${BR}“记住……水克火，盐克木，金克土。别搞错了顺序，不然大家一起死。”`,
    choices: [
      { id: 'c_ask_clue', text: '追问什么意思', nextSceneId: 'room_302_silence', type: 'normal' },
      { id: 'c_leave_302', text: '离开', nextSceneId: 'hallway_start', type: 'normal' },
    ],
  },
  'room_302_silence': {
    id: 'room_302_silence',
    title: '沉默',
    text: `无论你怎么拍门，里面再也没有声音传出。${BR}只是当你转身离开时，你总感觉那只猫眼依然在死死盯着你的后背。`,
    choices: [
      { id: 'c_back_hall', text: '回走廊', nextSceneId: 'hallway_start', type: 'normal' },
    ],
  },

  'washroom_enter': {
    id: 'washroom_enter',
    title: '公共盥洗室',
    text: `推开盥洗室的门，一股阴冷的湿气扑面而来，夹杂着下水道的腐臭。${BR}地砖上积着一层浑浊的黑水，倒映着天花板上摇摇欲坠、滋滋作响的灯管。${BR}这里有一排生锈的水龙头，其中一个没关紧，正滴着水。${BR}滴答……滴答……${BR}水槽的下水口似乎堵住了，积满了黑水。${BR}角落的脏衣篓里，露出了一只破旧布娃娃的手臂。`,
    choices: [
      { id: 'c_sink', text: '检查水槽', nextSceneId: 'sink_event', type: 'investigate', hideIfItem: '铁门钥匙' },
      { id: 'c_doll', text: '捡起布娃娃', nextSceneId: 'doll_get', type: 'normal', hideIfItem: '破旧布娃娃' },
      { id: 'c_leave', text: '离开这里', nextSceneId: 'hallway_mid_transition', type: 'normal' },
    ],
  },
  'doll_get': {
    id: 'doll_get',
    title: '独臂娃娃',
    text: `你捡起了那个布娃娃。它少了一只胳膊，棉絮从伤口处翻出来，已经发黑。头颅用红色的粗线歪歪扭扭地缝合过，看起来丑陋又可怜。${BR}但奇怪的是，当你抱起它时，周围刺骨的寒意似乎消散了一些。${BR}娃娃的口袋里塞着一张泛黄的纸条，字迹稚嫩：${BR}“贝贝怕火，贝贝想回家。”`,
    choices: [
      { id: 'c_keep_doll', text: '收好娃娃', nextSceneId: 'washroom_enter', getItem: '破旧布娃娃', type: 'normal' },
    ],
  },
  'sink_event': {
    id: 'sink_event',
    title: '水中发丝',
    text: `水槽里积满了黑水，水面上漂浮着一大团纠结的长发，随着水波微微起伏，像是一团活着的水藻。${BR}在发团的中央，隐约可以看到一把银色的钥匙在闪光。${BR}你必须要这把钥匙，但你的直觉在疯狂尖叫：水下有东西。它在等待猎物。`,
    choices: [
      { id: 'c_use_salt', text: '撒一把粗盐', nextSceneId: 'water_ghost_salt', type: 'investigate', requiredItem: '粗盐' },
      { id: 'c_grab_key', text: '用打火机烧', nextSceneId: 'water_ghost_fire', sanityCost: 10, type: 'danger', requiredItem: '打火机' },
      { id: 'c_no_item', text: '徒手去捞', nextSceneId: 'water_death', type: 'danger' },
      { id: 'c_back', text: '先不碰它', nextSceneId: 'washroom_enter', type: 'normal' },
    ],
  },
  'water_death': {
    id: 'water_death',
    title: '坏结局：水鬼替身',
    text: `你的手刚触碰到水面，冰冷刺骨。${BR}突然，那团黑发像活物一样瞬间炸开！无数根发丝像钢丝一样死死缠住了你的手腕。${BR}巨大的力量将你往水槽里拖拽，那个小小的下水口仿佛通向深渊。${BR}你看见水面浮现出一张惨白、浮肿的脸，它没有眼睛，只有一张黑洞洞的嘴，一口咬住了你的手指。${BR}咕噜……咕噜……${BR}你也成为了这里的一部分。`,
    choices: [
      { id: 'c_restart', text: '重新开始', nextSceneId: 'start', type: 'end' }
    ],
    endingType: 'bad',
  },
  'water_ghost_fire': {
    id: 'water_ghost_fire',
    title: '死里逃生',
    text: `黑发缠上你手腕的瞬间，你掏出父亲的打火机，狠狠按了下去！${BR}“轰！”${BR}微弱的火苗在接触到头发的瞬间，竟然像遇到了汽油一样爆燃。${BR}伴随着一声凄厉的、不似人声的尖叫，头发像触电般缩回了下水道。${BR}但因为距离太近，你的手也被严重烧伤。${BR}恶臭的黑烟腾起。你忍痛抓起那把钥匙，跌跌撞撞地退到了门口。`,
    choices: [
      { id: 'c_flee', text: '逃离盥洗室', nextSceneId: 'hallway_mid_transition', getItem: '铁门钥匙', type: 'danger' },
    ],
    visualEffect: 'shake',
    soundCue: '[ 获得物品：铁门钥匙 | 状态：受伤 ]',
  },
  'water_ghost_salt': {
    id: 'water_ghost_salt',
    title: '驱邪',
    text: `你想起302怪人的话，“盐克木”？不，盐能驱邪。${BR}你抓起一把粗盐，狠狠撒向水槽。${BR}“滋啦——！”${BR}就像把水倒进了滚油里，黑水剧烈沸腾起来，冒出腥臭的白烟。${BR}水下的东西似乎极其痛苦，疯狂地拍打着水槽壁，然后迅速退缩回了下水道深处。${BR}黑发散开，沉入水底。${BR}你从容地伸手，拿起了那把钥匙。没有受到任何攻击。`,
    choices: [
      { id: 'c_leave_smart', text: '离开盥洗室', nextSceneId: 'hallway_mid_transition', getItem: '铁门钥匙', type: 'normal' },
    ],
    effect: (state) => ({ ...state, sanity: Math.min(100, state.sanity + 10) }),
    soundCue: '[ 获得物品：铁门钥匙 | 理智 +10 ]',
  },

  // ---------------------------------------------------------
  // 第三章：深渊（鬼打墙与灵堂）
  // ---------------------------------------------------------
  'hallway_mid_transition': {
    id: 'hallway_mid_transition',
    title: '走廊深处',
    text: `拿到钥匙并不是结束，只是开始。${BR}越往里走，光线越暗，仿佛被黑暗吞噬。空气中那股线香的味道浓烈得呛人。${BR}楼道变得更加狭窄，墙壁上的霉斑组成了扭曲的人脸形状。${BR}前方有两条路：${BR}右手边是304室，门框上挂着惨白的挽联，门虚掩着，透出摇曳的绿光。${BR}左手边是305室，门板焦黑，那是曾经发生过火灾的地方。${BR}而尽头，是向下的楼梯。`,
    choices: [
      { id: 'c_304', text: '进入304室（灵堂）', nextSceneId: 'room_304_enter', type: 'danger' },
      { id: 'c_305', text: '进入305室（哭声）', nextSceneId: 'room_305_enter', type: 'investigate', hideIfFlag: 'girl_saved' },
      { id: 'c_305_done', text: '进入305室（余烬）', nextSceneId: 'room_305_resolved', type: 'normal', requiredFlag: 'girl_saved' },
      { id: 'c_stairs', text: '尝试下楼', nextSceneId: 'stairs_loop', type: 'normal', hideIfFlag: 'ghost_paid' },
      { id: 'c_stairs_open', text: '走向楼梯（已开路）', nextSceneId: 'stairs_clear', type: 'normal', requiredFlag: 'ghost_paid' },
    ],
  },
  'room_305_enter': {
    id: 'room_305_enter',
    title: '305：火海',
    text: `推开门，热浪扑面而来。${BR}这间屋子维持着火灾发生时的惨状，家具都已碳化，墙壁被熏得漆黑。${BR}空气中不仅有焦糊味，还有一股烤肉的味道，让人作呕。${BR}墙角蜷缩着一个黑乎乎的小影子，正在低声抽泣。${BR}“贝贝好疼……贝贝想出去……”${BR}它转过头，脸上是烧焦的皮肤，只有一双眼睛依然清澈，但充满了痛苦。`,
    choices: [
      { id: 'c_give_doll', text: '把布娃娃给它', nextSceneId: 'room_305_resolved', requiredItem: '破旧布娃娃', type: 'normal', effect: (state) => ({ ...state, flags: { ...state.flags, girl_saved: true }, sanity: Math.min(100, state.sanity + 20) }) },
      { id: 'c_talk_girl', text: '试图安抚', nextSceneId: 'girl_burn', type: 'danger' },
      { id: 'c_leave_305', text: '离开', nextSceneId: 'hallway_mid_transition', type: 'normal' },
    ],
  },
  'girl_burn': {
    id: 'girl_burn',
    title: '烈焰',
    text: `你刚靠近，它突然发出尖叫：“别过来！好烫！”${BR}轰的一声，周围的幻象火焰瞬间暴涨，将你吞没。${BR}你的皮肤感受到了真实的灼烧感。`,
    choices: [
      { id: 'c_run_305', text: '逃出房间', nextSceneId: 'hallway_mid_transition', sanityCost: 15, type: 'danger' },
    ],
    visualEffect: 'shake',
    soundCue: '[ 警告：遭受火焰灼烧 ]',
  },
  'room_305_resolved': {
    id: 'room_305_resolved',
    title: '安息',
    text: `小女孩抱着布娃娃，烧焦的皮肤仿佛在脱落，露出了原本白净的脸庞。${BR}“谢谢……贝贝不疼了。”${BR}她的身影渐渐变淡，化作点点荧光消失了。${BR}房间里的焦糊味散去，只剩下一种雨后的清新。${BR}你在她消失的地方，看到了一枚亮晶晶的东西——那是一枚铜钱，和电话里掉出来的一模一样。`,
    choices: [
      { id: 'c_get_coin_2', text: '捡起铜钱', nextSceneId: 'hallway_mid_transition', getItem: '古铜钱', type: 'normal' },
      { id: 'c_leave_305_res', text: '离开', nextSceneId: 'hallway_mid_transition', type: 'normal' },
    ],
  },
  'room_304_enter': {
    id: 'room_304_enter',
    title: '304：灵堂',
    text: `这是一间被布置成灵堂的房间。${BR}正中央摆着一口黑漆棺材，供桌上点着两根白蜡烛，火苗是绿色的。${BR}遗像被黑布蒙着。${BR}棺材盖没有盖严，一只苍白的手挂在外面，手指上戴着一枚扳指。${BR}“咚……咚……”${BR}棺材里传来了敲击声。`,
    choices: [
      { id: 'c_open_coffin', text: '推开棺盖', nextSceneId: 'coffin_death', type: 'danger' },
      { id: 'c_bow', text: '鞠躬后离开', nextSceneId: 'hallway_mid_transition', type: 'normal' },
    ],
  },
  'coffin_death': {
    id: 'coffin_death',
    title: '坏结局：同棺',
    text: `你推开棺盖，里面躺着的不是别人，正是你自己！${BR}棺材里的你猛地睁开眼，死死掐住了你的脖子。${BR}“既然来了，就别走了。”${BR}你被拖进了棺材，盖子重重合上。${BR}黑暗，永恒的黑暗。`,
    choices: [
      { id: 'c_restart', text: '重新开始', nextSceneId: 'start', type: 'end' }
    ],
    endingType: 'bad',
  },
  'stairs_loop': {
    id: 'stairs_loop',
    title: '鬼打墙',
    text: `你沿着楼梯向下走，转过拐角，却发现自己又回到了三楼的走廊口！${BR}墙上的“福”字依然倒贴着。${BR}不管你试多少次，只要下楼，就会回到原点。${BR}楼梯口蹲着一个模糊的老头，手里拿着一个破碗，正叮当叮当敲着。${BR}“过路钱，过路钱，没钱莫过鬼门关。”`,
    choices: [
      { id: 'c_give_money', text: '给一枚铜钱', nextSceneId: 'stairs_clear', requiredItem: '古铜钱', type: 'normal', effect: (state) => ({ ...state, flags: { ...state.flags, ghost_paid: true }, inventory: state.inventory.filter(i => i !== '古铜钱') }) },
      { id: 'c_ignore_ghost', text: '强行冲过去', nextSceneId: 'stairs_death', type: 'danger' },
      { id: 'c_back_hallway', text: '回走廊找线索', nextSceneId: 'hallway_mid_transition', type: 'normal' },
    ],
  },
  'stairs_death': {
    id: 'stairs_death',
    title: '坏结局：无尽楼梯',
    text: `你无视老头的乞讨，强行冲下楼梯。${BR}老头发出阴森的怪笑：“坏规矩……坏规矩……”${BR}你拼命往下跑，三楼、二楼、一楼……地下室……地下十八层……${BR}这楼梯仿佛没有尽头。你跑得肺都要炸了，却永远在楼梯间里打转。${BR}最后，你累死在了台阶上，成为了新的台阶。`,
    choices: [
      { id: 'c_restart', text: '重新开始', nextSceneId: 'start', type: 'end' }
    ],
    endingType: 'bad',
  },
  'stairs_clear': {
    id: 'stairs_clear',
    title: '生路',
    text: `老头收了铜钱，咧开没牙的嘴笑了。${BR}“好人，好人……走吧，天快亮了。”${BR}他侧身让开了路。${BR}你再次走下楼梯，这一次，风不再是阴冷的，而是带着一丝夜晚的凉意。${BR}你看见了一楼的大门，门缝里透进来了久违的晨光。`,
    choices: [
      { id: 'c_escape', text: '推开大门', nextSceneId: 'true_end', type: 'normal' },
    ],
  },
  'true_end': {
    id: 'true_end',
    title: '真结局：苏醒',
    text: `大门推开的瞬间，刺眼的白光吞没了你。${BR}滴答……滴答……${BR}仪器声变得清晰。${BR}“心跳恢复！血压回升！”${BR}“回来了！他回来了！”${BR}你猛地睁开眼，看到的不是发霉的天花板，而是医院洁白的墙壁和无影灯。${BR}母亲正握着你的手，泣不成声。${BR}你活过来了。${BR}但当你看向窗外时，玻璃倒影里，似乎有一个穿着雨衣的人影，正对着你挥手告别。`,
    choices: [
      { id: 'c_restart_true', text: '再次挑战', nextSceneId: 'start', type: 'end' }
    ],
    endingType: 'true',
  },
  'game_over_death': {
    id: 'game_over_death',
    title: '理智崩坏',
    text: `恐惧终于压垮了你最后一根神经。${BR}你在这个充满恶意的世界里彻底疯狂。${BR}你忘记了自己是谁，忘记了要逃出去。${BR}你开始觉得这里的怪物很亲切，你开始觉得墙上的霉斑很美味。${BR}你，成为了这栋楼的一部分。`,
    choices: [
      { id: 'c_restart_insane', text: '重新开始', nextSceneId: 'start', type: 'end' }
    ],
    endingType: 'bad',
  }
};
