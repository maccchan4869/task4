window.onload = () => {
  let questions = '';
  let idxQuestion = 0;
  let noCorrectAns = 0;
  const btnStart = document.getElementById('btnStart');
  const btnReload = document.getElementById('btnReload');
  const title = document.getElementById('title');
  const category = document.getElementById('category');
  const difficulty = document.getElementById('difficulty');
  const question = document.getElementById('question');
  const divAns = document.getElementById('divAns');

  btnReload.style.display = 'none';

  const setEvent = () => {
    // 開始ボタン押下時の処理
    btnStart.addEventListener('click', () => {
      title.textContent = '取得中';
      question.textContent = '少々お待ちください';
      btnStart.style.display = 'none';
      fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then((res)=>{
          if(res.ok){
            return( res.text() );
          }
        })
        .then((text)=>{
          const json = JSON.parse(text);
          questions = json.results;
          dispQuestion();
        });
    });

    // ホームに戻るボタン押下時の処理
    btnReload.addEventListener('click', () => {
      location.reload();
    });
  }

  /**
   * クイズを表示する
   */
  const dispQuestion = () => {
    const row = questions[idxQuestion];
    const noQuestion = idxQuestion + 1;
    const choices = createAnswers(row.incorrect_answers, row.correct_answer);
    title.textContent = `問題${noQuestion}`;
    category.textContent = `【ジャンル】${row.category}`;
    difficulty.textContent = `【難易度】${row.difficulty}`;
    question.textContent = row.question;
    choices.forEach((value) => {
      divAns.appendChild(createButton(value));
    });
  }

  /**
   * 選択肢の配列を生成
   *  
   * @param {object} incorrects - 不正解の回答
   * @param {string} correct    - 正解の回答
   * @return {object} array     - 選択肢の配列
   */
  const createAnswers = (incorrects, correct) => {
    const array = [];
    incorrects.forEach((value) => {
      array.push({choice: value, isCorrectAns: false});
    });
    array.push({choice: correct, isCorrectAns: true});
    array.forEach((idx1) => {
      const idx2 = Math.floor(Math.random() * (idx1 + 1));
      [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
    });
    return array;
  }

  /**
   * 回答ボタンを生成
   *  
   * @param {object} value      - 回答
   * @return {object} button    - buttonのdivDOM
   */
  const createButton = (value) => {
    const div = document.createElement('div');
    const button = document.createElement('input');
    button.type = 'button';
    button.value = value.choice;
    button.onclick = () => { onClickAnsBtn(value.isCorrectAns); };
    div.appendChild(button);
    return div;
  };

  /**
   * 選択肢押下処理
   *  
   * @param {boolean} isCorrectAns - 正誤(true:正解, false:不正解)
   */
  const onClickAnsBtn = (isCorrectAns) => {
    // ボタンを消去
    divAns.textContent = '';
    if(isCorrectAns) noCorrectAns += 1;
    // 回答した問題数に応じて処理を分岐
    if(idxQuestion === questions.length - 1) {
      title.textContent = `あなたの正解数は${noCorrectAns}です！！`;
      category.textContent = '';
      difficulty.textContent = '';
      question.textContent = '再チャレンジしたい場合は以下をクリック！！';
      btnReload.style.display = '';
    } else {
      idxQuestion += 1;
      dispQuestion();
    }
  };

  setEvent();
};