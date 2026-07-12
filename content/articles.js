window.PREFLOP_ARTICLES = [
  {
    id: "icm-tournament-survival-value",
    title: "ICMとは？初心者でも5分でわかる「トーナメントで生き残る価値」",
    subtitle: "トーナメントではチップ＝お金ではない。賞金期待値を最大化するためのICM入門。",
    author: "ユウジ",
    category: "トーナメント",
    date: "2026-07-12",
    readTime: "5分",
    memberOnly: true,
    featured: false,
    tags: ["ICM", "トーナメント", "ファイナルテーブル", "リスクプレミアム"],
    images: {
      roadmap: "./assets/articles/icm-tournament-survival-value/01-tournament-roadmap.jpg"
    },
    summary: [
      "ICMはチップを賞金期待値として考えるためのルール。",
      "トーナメントでは、増える価値より失うダメージが大きい場面がある。",
      "生き残る価値を理解すると、バブルやFTの判断が変わる。"
    ],
    body: [
      {
        type: "key-value",
        label: "まず結論",
        value: "ICMとは、チップをお金として考えるためのルール。",
        note: "トーナメントでは 1000チップ = 1000円 ではありません。これが一番大事です。"
      },
      {
        type: "heading",
        text: "キャッシュゲームとトーナメントの違い"
      },
      {
        type: "compare",
        items: [
          {
            label: "Cash Game",
            title: "チップ = お金",
            text: "1万点が2万点になれば、資産もほぼ2倍。チップを増やすことがそのまま利益になります。"
          },
          {
            label: "Tournament",
            title: "チップ = 賞金期待値ではない",
            text: "賞金は順位で決まります。チップを2倍にしても、賞金の期待値が2倍になるとは限りません。"
          }
        ]
      },
      {
        type: "paragraph",
        text: "トーナメントで重要なのは、チップそのものではなく、そのチップでどれくらい賞金を獲得できそうかです。これを計算する考え方がICMです。"
      },
      {
        type: "heading",
        text: "イメージすると分かりやすい"
      },
      {
        type: "scenario",
        kicker: "3人残りの例",
        title: "Aが500点を持っていても、それは50万円ではない",
        rows: [
          ["残りスタック", "A：500点 / B：300点 / C：200点"],
          ["賞金", "1位：100万円 / 2位：60万円 / 3位：0円"],
          ["大事な見方", "Aはまだ優勝していない。Cもまだ逆転できる。"]
        ],
        note: "ICMは「今このチップなら、平均すると賞金はいくらくらいになる？」を計算しています。"
      },
      {
        type: "image",
        src: "./assets/articles/icm-tournament-survival-value/01-tournament-roadmap.jpg",
        alt: "GINGA式トーナメント強化ロードマップ",
        caption: "トーナメント判断を迷わないOSにするロードマップ。ICMはPhase 1のバブル、Phase 3のICM学習、Phase 4の改善ループにつながります。"
      },
      {
        type: "heading",
        text: "なぜICMが重要なの？"
      },
      {
        type: "paragraph",
        text: "初心者が一番勘違いしやすいのは、チップを増やせるなら戦った方がいいと思ってしまうことです。でもトーナメントでは、チップを増やす価値より、失うダメージの方が大きい場面があります。"
      },
      {
        type: "scenario",
        kicker: "ファイナルテーブル",
        title: "あと1人飛べば賞金が倍になる場面",
        rows: [
          ["勝負", "勝率55%のオールイン勝負"],
          ["キャッシュゲーム", "55%なら戦う"],
          ["トーナメント", "負けた瞬間に賞金が半分になるなら、降りた方が高EVになることがある"]
        ],
        note: "少し有利な勝負でも、賞金期待値で見るとフォールドが正解になる。これがICMです。"
      },
      {
        type: "callout",
        text: "ICMの本質は、生き残る価値を計算すること。トーナメントの目的はチップを増やすことではなく、賞金期待値を増やすことです。"
      },
      {
        type: "heading",
        text: "リスクプレミアムとは？"
      },
      {
        type: "paragraph",
        text: "ICMを理解したら、次はリスクプレミアムです。難しく聞こえますが、意味はシンプルです。負けるリスクがあるから、いつもより強いハンドでしか戦えない、ということです。"
      },
      {
        type: "compare",
        items: [
          {
            label: "Cash Game",
            title: "必要勝率38%でコールできる",
            text: "チップとお金がほぼ直結しているので、ポットオッズに対して勝率が足りていれば戦いやすい。"
          },
          {
            label: "Tournament",
            title: "必要勝率47%になることがある",
            text: "ICMがあるので、同じハンドでもキャッシュならコール、トーナメントならフォールドになります。"
          }
        ]
      },
      {
        type: "paragraph",
        text: "勝ったらチップは増えます。でも、負けたら大会が終わります。つまり失うダメージの方が大きい。だから同じ勝率では戦えなくなるのです。"
      },
      {
        type: "heading",
        text: "ビッグスタックが強い理由"
      },
      {
        type: "stack-pressure",
        items: [
          {
            stack: "Big Stack",
            title: "負けてもまだ戦える",
            text: "相手に脱落リスクを背負わせられるので、プレッシャーをかけやすい。"
          },
          {
            stack: "Short Stack",
            title: "一度負けたら終わる",
            text: "ICMの圧力を強く受けるため、強いハンド中心で慎重に戦う必要がある。"
          }
        ]
      },
      {
        type: "heading",
        text: "ICMで覚えるべき5つ"
      },
      {
        type: "checklist",
        title: "まずは計算より、この5つを覚える",
        items: [
          "トーナメントではチップ＝お金ではない。",
          "生き残る価値がある。",
          "少し有利な勝負でも降りることがある。",
          "ショートスタックほど慎重になる。",
          "ビッグスタックほど攻めやすくなる。"
        ]
      },
      {
        type: "heading",
        text: "初心者が最初に覚えること"
      },
      {
        type: "paragraph",
        text: "ICMを最初から計算する必要はありません。最初に覚えるべきなのは、トーナメントではチップを増やすことではなく、賞金期待値を最大化するゲームである、という考え方です。"
      },
      {
        type: "callout",
        text: "ICMとは、チップを賞金期待値に変換する考え方。トーナメントの勝利条件は、チップの最大化ではなく、賞金期待値（トーナメントエクイティ）の最大化です。"
      }
    ]
  },
  {
    id: "poker-essence-range-equity",
    title: "ポーカーの本質：レンジ表とエクイティで見る勝ち筋",
    subtitle: "プリフロップ表は暗記表ではなく、強いハンドが後ろに残る確率を管理する地図。",
    author: "ユウジ",
    category: "本質解説",
    date: "2026-06-13",
    readTime: "8分",
    memberOnly: true,
    featured: true,
    tags: ["プリフロップ", "レンジ", "エクイティ"],
    images: {
      overview: "./assets/poker-essence-source.jpg",
      part1: "./assets/poker-essence-part-1.jpg",
      part2: "./assets/poker-essence-part-2.jpg"
    },
    summary: [
      "AAが配られる確率は約220分の1。",
      "自分の手だけではなく、後ろに強いハンドが残る確率を見る。",
      "ポーカーはチップではなく、エクイティを奪い合うゲーム。"
    ],
    body: [
      {
        type: "heading",
        text: "ポーカーの本質①：なぜプリフロップ表が存在するのか"
      },
      {
        type: "paragraph",
        text: "まず、エーシーズ（AA）が配られる確率は、約220分の1（0.45%）です。これだけ聞くと、エーシーズなんて滅多に来ない最強ハンドと思うかもしれません。"
      },
      {
        type: "paragraph",
        text: "でも、ポーカーは自分だけのゲームではありません。あなたがUTGでキングス（KK）を持っていたとしても、後ろにたくさんのプレイヤーが残っているなら、誰かがAAを持っている可能性を考える必要があります。"
      },
      {
        type: "callout",
        text: "レンジ表とは「後ろにもっと強いハンドがいる確率」を管理するための地図です。単なる暗記表ではありません。"
      },
      {
        type: "image-pair",
        title: "元図解を2つの章で読む",
        items: [
          {
            title: "① プリフロップ表の本質：確率の縮小",
            src: "./assets/poker-essence-part-1.jpg",
            alt: "プリフロップ表の本質を説明した図解"
          },
          {
            title: "② ポーカーの本質：エクイティを奪い、取り切る",
            src: "./assets/poker-essence-part-2.jpg",
            alt: "エクイティを奪うゲームを説明した図解"
          }
        ]
      },
      {
        type: "heading",
        text: "ポーカーの本質②：ポーカーはエクイティを奪い合うゲーム"
      },
      {
        type: "paragraph",
        text: "ポーカーは、正確にはエクイティ（ポットを獲得する権利）を奪い合うゲームです。AA vs 56sなら、プリフロップではAAが約81%、56sが約19%の勝率を持っています。"
      },
      {
        type: "equity",
        streets: [
          ["Preflop", "AA 81%", "56s 19%"],
          ["Flop", "AA 92%", "56s 8%"],
          ["Turn", "AA 97%", "56s 3%"],
          ["River", "AA 100%", "56s 0%"]
        ]
      },
      {
        type: "paragraph",
        text: "56sは負けています。でも、19%のポットの権利は持っています。AA側がフロップ、ターン、リバーまでプレッシャーをかけて相手をフォールドさせたなら、その19%の権利は消えます。"
      },
      {
        type: "heading",
        text: "だから、強い時は取り切る"
      },
      {
        type: "paragraph",
        text: "勝っている時はバリューベットを打つ。相手のチップを奪うというより、自分が持っているエクイティを現実のチップに変換するという感覚です。"
      },
      {
        type: "callout",
        text: "プリフロップ表は確率の地図。ポストフロップのベットはエクイティ操作。この二つを理解すると、ポーカーは不完全情報下で期待値を最大化するゲームだと見えてきます。"
      }
    ]
  },
  {
    id: "btn-open-range",
    title: "BTNで参加レンジが広がる理由",
    subtitle: "後ろに残る人数が少ないほど、強いハンドにぶつかる確率は下がる。",
    author: "ユウジ",
    category: "プリフロップ",
    date: "2026-06-20",
    readTime: "5分",
    memberOnly: true,
    featured: false,
    tags: ["BTN", "ポジション", "レンジ"],
    summary: ["BTNは後ろがSB/BBだけ。", "広げてよい理由は運ではなく確率。", "広げすぎるとBBのディフェンスに負ける。"],
    body: [
      { "type": "heading", "text": "次回記事の下書き枠" },
      { "type": "paragraph", "text": "ここにユウジさんの次回記事本文を入れます。content/articles.js に1オブジェクト追加するだけで、記事一覧と詳細ページへ反映されます。" }
    ]
  }
];
