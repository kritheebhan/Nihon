export const HIRA = {
  basic:[
    {r:'a-row',chars:[{c:'あ',r:'a',e:'ah'},{c:'い',r:'i',e:'ee'},{c:'う',r:'u',e:'oo'},{c:'え',r:'e',e:'eh'},{c:'お',r:'o',e:'oh'}]},
    {r:'ka-row',chars:[{c:'か',r:'ka',e:''},{c:'き',r:'ki',e:''},{c:'く',r:'ku',e:''},{c:'け',r:'ke',e:''},{c:'こ',r:'ko',e:''}]},
    {r:'sa-row',chars:[{c:'さ',r:'sa',e:''},{c:'し',r:'shi',e:'*shi not si'},{c:'す',r:'su',e:''},{c:'せ',r:'se',e:''},{c:'そ',r:'so',e:''}]},
    {r:'ta-row',chars:[{c:'た',r:'ta',e:''},{c:'ち',r:'chi',e:'*chi not ti'},{c:'つ',r:'tsu',e:'*tsu not tu'},{c:'て',r:'te',e:''},{c:'と',r:'to',e:''}]},
    {r:'na-row',chars:[{c:'な',r:'na',e:''},{c:'に',r:'ni',e:''},{c:'ぬ',r:'nu',e:''},{c:'ね',r:'ne',e:''},{c:'の',r:'no',e:''}]},
    {r:'ha-row',chars:[{c:'は',r:'ha',e:'wa as particle'},{c:'ひ',r:'hi',e:''},{c:'ふ',r:'fu',e:'*fu not hu'},{c:'へ',r:'he',e:'e as particle'},{c:'ほ',r:'ho',e:''}]},
    {r:'ma-row',chars:[{c:'ま',r:'ma',e:''},{c:'み',r:'mi',e:''},{c:'む',r:'mu',e:''},{c:'め',r:'me',e:''},{c:'も',r:'mo',e:''}]},
    {r:'ya-row',chars:[{c:'や',r:'ya',e:''},{c:'ゆ',r:'yu',e:''},{c:'よ',r:'yo',e:''}]},
    {r:'ra-row',chars:[{c:'ら',r:'ra',e:''},{c:'り',r:'ri',e:''},{c:'る',r:'ru',e:''},{c:'れ',r:'re',e:''},{c:'ろ',r:'ro',e:''}]},
    {r:'wa-row',chars:[{c:'わ',r:'wa',e:''},{c:'を',r:'wo',e:'object particle'},{c:'ん',r:'n',e:'standalone n'}]}
  ],
  dakuten:[
    {r:'ga-row',chars:[{c:'が',r:'ga'},{c:'ぎ',r:'gi'},{c:'ぐ',r:'gu'},{c:'げ',r:'ge'},{c:'ご',r:'go'}]},
    {r:'za-row',chars:[{c:'ざ',r:'za'},{c:'じ',r:'ji'},{c:'ず',r:'zu'},{c:'ぜ',r:'ze'},{c:'ぞ',r:'zo'}]},
    {r:'da-row',chars:[{c:'だ',r:'da'},{c:'ぢ',r:'ji*'},{c:'づ',r:'zu*'},{c:'で',r:'de'},{c:'ど',r:'do'}]},
    {r:'ba-row',chars:[{c:'ば',r:'ba'},{c:'び',r:'bi'},{c:'ぶ',r:'bu'},{c:'べ',r:'be'},{c:'ぼ',r:'bo'}]},
    {r:'pa-row (semi-voiced)',chars:[{c:'ぱ',r:'pa'},{c:'ぴ',r:'pi'},{c:'ぷ',r:'pu'},{c:'ぺ',r:'pe'},{c:'ぽ',r:'po'}]}
  ],
  combo:[
    {r:'kya-row',chars:[{c:'きゃ',r:'kya'},{c:'きゅ',r:'kyu'},{c:'きょ',r:'kyo'}]},
    {r:'sha-row',chars:[{c:'しゃ',r:'sha'},{c:'しゅ',r:'shu'},{c:'しょ',r:'sho'}]},
    {r:'cha-row',chars:[{c:'ちゃ',r:'cha'},{c:'ちゅ',r:'chu'},{c:'ちょ',r:'cho'}]},
    {r:'nya-row',chars:[{c:'にゃ',r:'nya'},{c:'にゅ',r:'nyu'},{c:'にょ',r:'nyo'}]},
    {r:'hya-row',chars:[{c:'ひゃ',r:'hya'},{c:'ひゅ',r:'hyu'},{c:'ひょ',r:'hyo'}]},
    {r:'mya-row',chars:[{c:'みゃ',r:'mya'},{c:'みゅ',r:'myu'},{c:'みょ',r:'myo'}]},
    {r:'rya-row',chars:[{c:'りゃ',r:'rya'},{c:'りゅ',r:'ryu'},{c:'りょ',r:'ryo'}]},
    {r:'gya-row',chars:[{c:'ぎゃ',r:'gya'},{c:'ぎゅ',r:'gyu'},{c:'ぎょ',r:'gyo'}]},
    {r:'ja-row',chars:[{c:'じゃ',r:'ja'},{c:'じゅ',r:'ju'},{c:'じょ',r:'jo'}]},
    {r:'bya-row',chars:[{c:'びゃ',r:'bya'},{c:'びゅ',r:'byu'},{c:'びょ',r:'byo'}]},
    {r:'pya-row',chars:[{c:'ぴゃ',r:'pya'},{c:'ぴゅ',r:'pyu'},{c:'ぴょ',r:'pyo'}]}
  ]
};

export const KATA = {
  basic:[
    {r:'a-row',chars:[{c:'ア',r:'a',h:'あ'},{c:'イ',r:'i',h:'い'},{c:'ウ',r:'u',h:'う'},{c:'エ',r:'e',h:'え'},{c:'オ',r:'o',h:'お'}]},
    {r:'ka-row',chars:[{c:'カ',r:'ka',h:'か'},{c:'キ',r:'ki',h:'き'},{c:'ク',r:'ku',h:'く'},{c:'ケ',r:'ke',h:'け'},{c:'コ',r:'ko',h:'こ'}]},
    {r:'sa-row',chars:[{c:'サ',r:'sa',h:'さ'},{c:'シ',r:'shi',h:'し'},{c:'ス',r:'su',h:'す'},{c:'セ',r:'se',h:'せ'},{c:'ソ',r:'so',h:'そ'}]},
    {r:'ta-row',chars:[{c:'タ',r:'ta',h:'た'},{c:'チ',r:'chi',h:'ち'},{c:'ツ',r:'tsu',h:'つ'},{c:'テ',r:'te',h:'て'},{c:'ト',r:'to',h:'と'}]},
    {r:'na-row',chars:[{c:'ナ',r:'na',h:'な'},{c:'ニ',r:'ni',h:'に'},{c:'ヌ',r:'nu',h:'ぬ'},{c:'ネ',r:'ne',h:'ね'},{c:'ノ',r:'no',h:'の'}]},
    {r:'ha-row',chars:[{c:'ハ',r:'ha',h:'は'},{c:'ヒ',r:'hi',h:'ひ'},{c:'フ',r:'fu',h:'ふ'},{c:'ヘ',r:'he',h:'へ'},{c:'ホ',r:'ho',h:'ほ'}]},
    {r:'ma-row',chars:[{c:'マ',r:'ma',h:'ま'},{c:'ミ',r:'mi',h:'み'},{c:'ム',r:'mu',h:'む'},{c:'メ',r:'me',h:'め'},{c:'モ',r:'mo',h:'も'}]},
    {r:'ya-row',chars:[{c:'ヤ',r:'ya',h:'や'},{c:'ユ',r:'yu',h:'ゆ'},{c:'ヨ',r:'yo',h:'よ'}]},
    {r:'ra-row',chars:[{c:'ラ',r:'ra',h:'ら'},{c:'リ',r:'ri',h:'り'},{c:'ル',r:'ru',h:'る'},{c:'レ',r:'re',h:'れ'},{c:'ロ',r:'ro',h:'ろ'}]},
    {r:'wa-row',chars:[{c:'ワ',r:'wa',h:'わ'},{c:'ヲ',r:'wo',h:'を'},{c:'ン',r:'n',h:'ん'}]}
  ],
  dakuten:[
    {r:'ga-row',chars:[{c:'ガ',r:'ga'},{c:'ギ',r:'gi'},{c:'グ',r:'gu'},{c:'ゲ',r:'ge'},{c:'ゴ',r:'go'}]},
    {r:'za-row',chars:[{c:'ザ',r:'za'},{c:'ジ',r:'ji'},{c:'ズ',r:'zu'},{c:'ゼ',r:'ze'},{c:'ゾ',r:'zo'}]},
    {r:'da-row',chars:[{c:'ダ',r:'da'},{c:'ヂ',r:'ji*'},{c:'ヅ',r:'zu*'},{c:'デ',r:'de'},{c:'ド',r:'do'}]},
    {r:'ba-row',chars:[{c:'バ',r:'ba'},{c:'ビ',r:'bi'},{c:'ブ',r:'bu'},{c:'ベ',r:'be'},{c:'ボ',r:'bo'}]},
    {r:'pa-row',chars:[{c:'パ',r:'pa'},{c:'ピ',r:'pi'},{c:'プ',r:'pu'},{c:'ペ',r:'pe'},{c:'ポ',r:'po'}]}
  ],
  combo:[
    {r:'kya-row',chars:[{c:'キャ',r:'kya'},{c:'キュ',r:'kyu'},{c:'キョ',r:'kyo'}]},
    {r:'sha-row',chars:[{c:'シャ',r:'sha'},{c:'シュ',r:'shu'},{c:'ショ',r:'sho'}]},
    {r:'cha-row',chars:[{c:'チャ',r:'cha'},{c:'チュ',r:'chu'},{c:'チョ',r:'cho'}]},
    {r:'nya-row',chars:[{c:'ニャ',r:'nya'},{c:'ニュ',r:'nyu'},{c:'ニョ',r:'nyo'}]},
    {r:'hya-row',chars:[{c:'ヒャ',r:'hya'},{c:'ヒュ',r:'hyu'},{c:'ヒョ',r:'hyo'}]},
    {r:'mya-row',chars:[{c:'ミャ',r:'mya'},{c:'ミュ',r:'myu'},{c:'ミョ',r:'myo'}]},
    {r:'rya-row',chars:[{c:'リャ',r:'rya'},{c:'リュ',r:'ryu'},{c:'リョ',r:'ryo'}]},
    {r:'gya-row',chars:[{c:'ギャ',r:'gya'},{c:'ギュ',r:'gyu'},{c:'ギョ',r:'gyo'}]},
    {r:'ja-row',chars:[{c:'ジャ',r:'ja'},{c:'ジュ',r:'ju'},{c:'ジョ',r:'jo'}]},
    {r:'bya-row',chars:[{c:'ビャ',r:'bya'},{c:'ビュ',r:'byu'},{c:'ビョ',r:'byo'}]},
    {r:'pya-row',chars:[{c:'ピャ',r:'pya'},{c:'ピュ',r:'pyu'},{c:'ピョ',r:'pyo'}]},
    {r:'foreign-sounds',chars:[{c:'ファ',r:'fa'},{c:'フィ',r:'fi'},{c:'フェ',r:'fe'},{c:'フォ',r:'fo'},{c:'ウィ',r:'wi'},{c:'ウェ',r:'we'},{c:'ウォ',r:'wo2'},{c:'ティ',r:'ti'},{c:'ディ',r:'di'},{c:'ドゥ',r:'du'}]}
  ]
};
