'use strict';

function MessageHistory( {list} ) {

  if (list.length === 0 || !(list instanceof Array)) {
    return false;
  }

  let history = list.map( (message, index) => {
    switch (message.type) {
      case 'message':
        return <Message from = {message.from} message = {message} />
        break;
      case 'response':
        return <Response from = {message.from} message = {message} />
        break;
    }

  });

  return <ul>{ history }</ul>;
}

const messages = [{
  from: { name: 'Ольга' },
  type: 'message',
  time: '10:10',
  text: 'Привет, Виктор. Как дела? Как идет работа над проектом?'
}, {
  from: { name: 'Виктор' },
  type: 'message',
  time: '10:12',
  text: 'Привет. Давай сегодня созвонимся. Проект практически готов, и у меня есть что показать.'
}, {
  from: { name: 'Ольга' },
  type: 'message',
  time: '10:14',
  text: 'Не уверена что сегодня получится. Не все еще в офисе. Давай уточню через час. Возникли ли какие-либо проблемы на последней стадии проекта?'
}, {
  from: { name: 'Виктор' },
  type: 'message',
  time: '10:20',
  text: 'Нет, все прошло гладко. Очень хочу показать всё команде.'
}];

const flood = [{
  from: { name: 'Олег' },
  type: 'message',
  time: '10:10',
  text: 'Хай! Как дела? Какие планы на субботу?'
}, {
  from: { name: 'Алиса' },
  type: 'message',
  time: '10:10',
  text: 'Салют! Идём в лазертаг!'
}];

const chats = [{
  name: 'Рабочий чат',
  active: true
}, {
  name: 'Чат для общения',
  active: false
}];

function Response({ from, message }) {
  return (
    <li className="clearfix">
      <div className="message-data align-right">
        <span className="message-data-time" >{message.time}</span> &nbsp; &nbsp;
        <span className="message-data-name" >{from.name}</span> <i className="fa fa-circle me"></i>
      </div>
      <div className="message other-message float-right">
        {message.text}
      </div>
    </li>
  );
}

function Message({ from, message }) {
  return (
    <li>
      <div className="message-data">
        <span className="message-data-name">{from.name}</span>
        <span className="message-data-time">{message.time}</span>
      </div>
      <div className="message my-message">
        {message.text}
      </div>
    </li>
  );
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    if(!localStorage.workChat) {
      this.state = {messages: this.props.messages};
    } else {
      this.state = {messages: JSON.parse(localStorage.workChat)};
    }
  }
  
  componentDidMount() {
    const chatsBtn = document.querySelectorAll('.list li');
    for(let chatBtn of chatsBtn) {
      chatBtn.addEventListener('click', (event) => {
        for(let chatBtn of chatsBtn) {
          chatBtn.classList.remove('active');
        };
        event.currentTarget.classList.add('active');
        if(event.currentTarget.querySelector('.name').textContent === 'Рабочий чат' && !localStorage.workChat) {
          document.querySelector('.chat-with').textContent = 'Рабочий чат';
          this.setState({messages: messages});
        } else if(event.currentTarget.querySelector('.name').textContent === 'Рабочий чат' && localStorage.workChat) {
          document.querySelector('.chat-with').textContent = 'Рабочий чат';
          this.setState({messages: JSON.parse(localStorage.workChat)});
        } else if(!localStorage.floodChat && event.currentTarget.querySelector('.name').textContent !== 'Рабочий чат') {
          document.querySelector('.chat-with').textContent = 'Чат для общения';
          this.setState({messages: flood});
        } else {
          document.querySelector('.chat-with').textContent = 'Чат для общения';
          this.setState({messages: JSON.parse(localStorage.floodChat)});
        }
      })
    }
  }
  
  render(){
    const users = this.props.chats.map(chat => {
      return (
        <li className={chat.active ? 'clearfix active' : 'clearfix'}>
          <div className="about">
            <div className="name">{chat.name}</div>
          </div>
        </li>
      );
    }); 
    
    const onSubmit = (event) => {
      event.preventDefault();
      const time = new Date();
      const hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
      const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      let result = this.state.messages;
      result.push({
        from: { name: 'Я' },
        type: 'response',
        time: `${hour}:${minutes}`,
        text: event.target.sendMessage.value
      });
      this.setState({messages: result});
      if(document.querySelector('.active').textContent === 'Рабочий чат') {
        localStorage.workChat = JSON.stringify(result);
      } else {
        localStorage.floodChat = JSON.stringify(result);
      }
      document.querySelector('form').reset();
    }
  
  return (
    
    <div className="container clearfix">
      <div className="people-list" id="people-list">
        
        <ul className="list">
          { users }
        </ul>
      </div>

      <div className="chat">
        <div className="chat-header clearfix">

          <div className="chat-about">
            <div className="chat-with">Рабочий чат</div>
          </div>
        </div>

        <div className="chat-history">
          <MessageHistory list={this.state.messages} />
        </div>

        <div className="chat-message clearfix">

          

         
          
<form onSubmit={onSubmit}>
      <textarea name="sendMessage" id="message-to-send" placeholder ="Введите текст сообщения" rows="3"></textarea>
      <button type="submit">Отправить</button>
    </form>
        </div>

      </div>

    </div>
  );
  }
}


ReactDOM.render(
  <Chat chats={chats} messages={messages} />,
  document.getElementById('root')
);