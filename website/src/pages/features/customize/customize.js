import DeepChatBrowser from '../../../components/table/deepChatBrowser';
import OnVisibleAnimation from '../../utils/onVisibleAnimation';
import {useColorMode} from '@docusaurus/theme-common';
import BrowserOnly from '@docusaurus/BrowserOnly';
import React from 'react';
import './customize.css';

function ComponentsDark() {
  return (
    <div id="customize-content">
      <DeepChatBrowser
        stream={true}
        demo={true}
        initialMessages={[
          {text: 'Hey, how are you?', role: 'user'},
          {text: 'I am doing great, how about you?', role: 'ai'},
          {text: 'What is the meaning of life?', role: 'user'},
          {
            text: 'This completely depends on the person.',
            role: 'ai',
          },
        ]}
        containerStyle={{
          borderRadius: '10px',
          border: 'unset',
          backgroundColor: '#292929',
        }}
        messageStyles={{
          default: {
            ai: {
              bubble: {backgroundColor: '#545454', color: 'white'},
            },
          },
          loading: {
            bubble: {backgroundColor: '#545454', color: 'white'},
          },
        }}
        textInput={{
          styles: {
            container: {
              backgroundColor: '#666666',
              border: 'unset',
              color: '#e8e8e8',
            },
          },
          placeholder: {text: 'Insert your question here...', style: {color: '#bcbcbc'}},
        }}
        submitButtonStyles={{
          submit: {
            container: {
              default: {
                bottom: '0.7rem',
              },
            },
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(70%) sepia(52%) saturate(5617%) hue-rotate(185deg) brightness(101%) contrast(101%)',
                },
              },
            },
          },
          loading: {
            container: {
              default: {
                backgroundColor: 'unset',
              },
            },
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(70%) sepia(52%) saturate(5617%) hue-rotate(185deg) brightness(101%) contrast(101%)',
                },
              },
            },
          },
          stop: {
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(70%) sepia(52%) saturate(5617%) hue-rotate(185deg) brightness(101%) contrast(101%)',
                },
              },
            },
          },
        }}
        auxiliaryStyle="
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: grey;
            border-radius: 5px;
          }
          ::-webkit-scrollbar-track {
            background-color: unset;
          }"
      ></DeepChatBrowser>
      <DeepChatBrowser
        stream={true}
        demo={true}
        initialMessages={[
          {text: 'Hey, how are you?', role: 'user'},
          {text: 'I am doing great, how about you?', role: 'ai'},
          {text: 'What is the meaning of life?', role: 'user'},
          {
            text: 'This completely depends on the person.',
            role: 'ai',
          },
        ]}
        containerStyle={{
          borderRadius: '10px',
          border: 'unset',
          backgroundImage: "url('/img/lofi-background.webp')",
          backgroundSize: '320px 500px',
        }}
        messageStyles={{
          default: {
            user: {
              bubble: {
                background: 'linear-gradient(90deg, rgb(225 37 255) 0%, rgb(161, 99, 233) 100%)',
                color: 'white',
              },
            },
            ai: {
              bubble: {background: 'linear-gradient(90deg, rgb(0, 162, 255) 30%, rgb(197 119 255) 100%)', color: 'white'},
            },
          },
          loading: {
            bubble: {
              background: 'linear-gradient(90deg, rgb(0, 162, 255) 30%, rgb(197 119 255) 100%)',
              color: 'white',
            },
          },
        }}
        textInput={{
          styles: {
            container: {
              backgroundColor: 'rgb(239 245 255)',
              color: '#0d008d',
            },
          },
        }}
        submitButtonStyles={{
          submit: {
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(6989%) hue-rotate(288deg) brightness(107%) contrast(122%)',
                },
              },
            },
          },
          loading: {
            container: {
              default: {
                backgroundColor: 'unset',
              },
            },
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(6989%) hue-rotate(288deg) brightness(107%) contrast(122%)',
                },
              },
            },
          },
          stop: {
            container: {
              default: {
                backgroundColor: 'unset',
              },
            },
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(26%) sepia(95%) saturate(6989%) hue-rotate(288deg) brightness(107%) contrast(122%)',
                },
              },
            },
          },
        }}
        auxiliaryStyle="
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #54a7ff;
            border-radius: 5px;
          }
          ::-webkit-scrollbar-track {
            background-color: unset;
          }"
      ></DeepChatBrowser>
      <DeepChatBrowser
        stream={true}
        demo={true}
        initialMessages={[
          {text: 'Hey, how are you?', role: 'user'},
          {text: 'I am doing great, how about you?', role: 'ai'},
          {text: 'What is the meaning of life?', role: 'user'},
          {
            text: 'This completely depends on the person.',
            role: 'ai',
          },
        ]}
        containerStyle={{
          borderRadius: '10px',
          border: 'unset',
          backgroundImage: "url('/img/blue-background.jpg')",
          backgroundSize: '320px 500px',
        }}
        messageStyles={{
          default: {
            user: {bubble: {backgroundColor: '#2670ff'}},
            ai: {bubble: {backgroundColor: '#004f97', color: 'white'}},
          },
        }}
        submitButtonStyles={{
          submit: {
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(60%) sepia(79%) saturate(643%) hue-rotate(185deg) brightness(102%) contrast(100%)',
                },
              },
            },
          },
          loading: {
            container: {
              default: {
                backgroundColor: 'unset',
              },
            },
          },
        }}
        textInput={{
          styles: {
            container: {
              backgroundColor: '#004f97',
              color: 'white',
              boxShadow: 'unset',
            },
          },
          placeholder: {style: {color: '#d1d1d1'}},
        }}
        auxiliaryStyle="
          ::-webkit-scrollbar-thumb {
            background-color: #0174db;
          }
          ::-webkit-scrollbar-track {
            background-color: unset;
          }"
      ></DeepChatBrowser>
    </div>
  );
}

function IntroPanel() {
  return (
    <div style={{display: 'none'}}>
      <div
        style={{
          width: '250px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '-10px',
        }}
      >
        <div
          style={{
            backgroundColor: '#eef6ff',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
          <div style={{fontSize: '14px', lineHeight: '20px'}}>"Explain quantum computing in simple terms"</div>
        </div>
        <div
          style={{
            backgroundColor: '#eef6ff',
            borderRadius: '10px',
            padding: '10px',
            marginTop: '15px',
          }}
        >
          <div style={{fontSize: '14px', lineHeight: '20px'}}>Allows user to provide follow-up corrections</div>
        </div>
        <div
          style={{
            backgroundColor: '#eef6ff',
            borderRadius: '10px',
            padding: '10px',
            marginTop: '15px',
          }}
        >
          <div style={{fontSize: '14px', lineHeight: '20px'}}>May occasionally generate incorrect information</div>
        </div>
      </div>
    </div>
  );
}

function ComponentsLight() {
  return (
    <div id="customize-content">
      <DeepChatBrowser
        demo={true}
        initialMessages={[
          {text: 'Hey, how are you?', role: 'user'},
          {text: 'I am doing great, how about you?', role: 'ai'},
          {text: 'What is the meaning of life?', role: 'user'},
          {
            text: 'This completely depends on the person.',
            role: 'ai',
          },
        ]}
        containerStyle={{
          borderRadius: '10px',
          boxShadow: '0 .5rem 1rem 0 rgba(44, 51, 73, .1)',
          borderColor: '#ededed',
        }}
        messageStyles={{
          default: {
            shared: {bubble: {maxWidth: '100%', backgroundColor: 'unset', marginTop: '10px', marginBottom: '10px'}},
            user: {bubble: {marginLeft: '0px', color: 'black'}},
            ai: {
              outerContainer: {
                backgroundColor: 'rgba(247,247,248)',
                borderTop: '1px solid rgba(0,0,0,.1)',
                borderBottom: '1px solid rgba(0,0,0,.1)',
              },
            },
          },
        }}
        stream={true}
        avatars={{
          default: {styles: {position: 'left'}},
          ai: {
            src: '/img/openAIGreyLogo.svg',
            styles: {
              avatar: {
                filter:
                  'brightness(0) saturate(100%) invert(52%) sepia(0%) saturate(218%) hue-rotate(196deg) brightness(97%) contrast(94%)',
              },
            },
          },
        }}
        submitButtonStyles={{
          submit: {
            container: {
              default: {
                backgroundColor: '#19c37d',
              },
              hover: {
                backgroundColor: '#0bab69',
              },
              click: {
                backgroundColor: '#068e56',
              },
            },
            svg: {
              content:
                '<?xml version="1.0" encoding="utf-8"?> <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M21.66,12a2,2,0,0,1-1.14,1.81L5.87,20.75A2.08,2.08,0,0,1,5,21a2,2,0,0,1-1.82-2.82L5.46,13H11a1,1,0,0,0,0-2H5.46L3.18,5.87A2,2,0,0,1,5.86,3.25h0l14.65,6.94A2,2,0,0,1,21.66,12Z"> </path> </svg>',
              styles: {
                default: {
                  width: '1.3em',
                  marginTop: '0.15em',
                  filter:
                    'brightness(0) saturate(100%) invert(100%) sepia(28%) saturate(2%) hue-rotate(69deg) brightness(107%) contrast(100%)',
                },
              },
            },
          },
          loading: {
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%) contrast(96%)',
                },
              },
            },
          },
          stop: {
            container: {
              default: {backgroundColor: 'white'},
            },
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%) contrast(96%)',
                },
              },
            },
          },
        }}
        textInput={{placeholder: {text: `What's on your mind?`}}}
      ></DeepChatBrowser>
      <DeepChatBrowser
        demo={true}
        stream={true}
        containerStyle={{
          borderRadius: '10px',
          boxShadow: '0 .5rem 1rem 0 rgba(44, 51, 73, .1)',
          borderColor: '#ededed',
        }}
        names={true}
        submitButtonStyles={{
          submit: {
            container: {
              default: {backgroundColor: '#42a4ff'},
              hover: {backgroundColor: '#2b8ee9'},
              click: {backgroundColor: '#2280d8'},
            },
            text: {
              content: 'Submit',
              styles: {default: {color: 'white'}},
            },
          },
          loading: {
            container: {
              default: {backgroundColor: '#42a4ff'},
              hover: {backgroundColor: '#2b8ee9'},
              click: {backgroundColor: '#2280d8'},
            },
            text: {
              content: 'Loading',
              styles: {default: {color: 'white'}},
            },
          },
          stop: {
            container: {
              default: {backgroundColor: '#42a4ff'},
              hover: {backgroundColor: '#2b8ee9'},
              click: {backgroundColor: '#2280d8'},
            },
            text: {
              content: 'Stop',
              styles: {default: {color: 'white'}},
            },
          },
        }}
        messageStyles={{default: {user: {bubble: {backgroundColor: '#3da0ec'}}}}}
        textInput={{placeholder: {text: `How may I assist you?`}}}
      >
        <IntroPanel></IntroPanel>
      </DeepChatBrowser>
      <DeepChatBrowser
        stream={true}
        demo={true}
        initialMessages={[
          {text: 'Hey, how are you?', role: 'user'},
          {text: 'I am doing great, how about you?', role: 'ai'},
          {text: 'What is the meaning of life?', role: 'user'},
          {
            text: 'This completely depends on the person.',
            role: 'ai',
          },
        ]}
        containerStyle={{
          borderRadius: '10px',
          boxShadow: '0 .5rem 1rem 0 rgba(44, 51, 73, .1)',
          borderColor: '#ededed',
          backgroundColor: '#f1f6ff',
        }}
        textInput={{
          styles: {
            container: {
              borderRadius: '20px',
              border: '1px solid #b5b5b5',
              boxShadow: 'unset',
              width: '78%',
              marginLeft: '-15px',
            },
            text: {padding: '10px', paddingLeft: '15px', paddingRight: '34px'},
          },
          placeholder: {text: 'Enter a prompt here', style: {color: '#bcbcbc'}},
        }}
        messageStyles={{
          default: {
            shared: {bubble: {maxWidth: '100%', backgroundColor: 'unset', marginTop: '10px', marginBottom: '10px'}},
            user: {bubble: {marginLeft: '0px', color: 'black'}},
            ai: {innerContainer: {borderRadius: '15px', backgroundColor: 'white'}},
          },
        }}
        avatars={{
          default: {styles: {position: 'left', container: {marginLeft: '12px', marginRight: '5px'}}},
          ai: {src: '/img/googleBardLogo.png', styles: {position: 'left', avatar: {paddingTop: '6px'}}},
        }}
        microphone={{
          button: {
            default: {
              container: {default: {bottom: '1em', right: '0.6em', borderRadius: '20px', width: '1.9em', height: '1.9em'}},
              svg: {styles: {default: {bottom: '0.4em', left: '0.3em'}}},
            },
            position: 'inside-right',
          },
        }}
        submitButtonStyles={{
          position: 'outside-right',
          submit: {
            container: {
              default: {bottom: '0.75em', borderRadius: '25px', padding: '5px', backgroundColor: '#f3f6fc'},
              hover: {backgroundColor: '#b0deff4f'},
              click: {backgroundColor: '#b0deffb5'},
            },
            svg: {
              content:
                '<?xml version="1.0" encoding="utf-8"?> <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"/></svg>',
              styles: {
                default: {
                  width: '1.5em',
                  filter:
                    'brightness(0) saturate(100%) invert(10%) sepia(86%) saturate(6044%) hue-rotate(205deg) brightness(100%) contrast(100%)',
                },
              },
            },
          },
          loading: {
            container: {
              default: {backgroundColor: '#f3f6fc'},
            },
            svg: {
              styles: {
                default: {
                  filter:
                    'brightness(0) saturate(100%) invert(72%) sepia(0%) saturate(3044%) hue-rotate(322deg) brightness(100%) contrast(96%)',
                },
              },
            },
          },
        }}
      ></DeepChatBrowser>
    </div>
  );
}

function Components() {
  const {colorMode} = useColorMode();
  return colorMode === 'dark' ? <ComponentsDark></ComponentsDark> : <ComponentsLight></ComponentsLight>;
}

export default function Customize() {
  return (
    <BrowserOnly>
      {() => {
        return (
          <div id="customize">
            <OnVisibleAnimation
              beforeClass={'customize-content-bottom'}
              afterClass={'customize-content-top'}
              timeoutMS={50}
            >
              <div id="customize-sub-header" className="feature-sub-header">
                Customize with no limits
              </div>
              <Components></Components>
            </OnVisibleAnimation>
          </div>
        );
      }}
    </BrowserOnly>
  );
}
