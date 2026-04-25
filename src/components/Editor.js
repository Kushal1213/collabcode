import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

/**
 * Editor — wraps CodeMirror and syncs content over Socket.IO in real time.
 * Emits CODE_CHANGE on local keystrokes; listens for remote CODE_CHANGE events.
 */
const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
                lineWrapping: true,
            }
        );

        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);
            if (origin !== 'setValue') {
                socketRef.current?.emit(ACTIONS.CODE_CHANGE, { roomId, code });
            }
        });

        return () => { editorRef.current?.toTextArea(); };
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;
        socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            if (code !== null && editorRef.current) {
                editorRef.current.setValue(code);
            }
        });
        return () => { socket.off(ACTIONS.CODE_CHANGE); };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor" />;
};

export default Editor;
