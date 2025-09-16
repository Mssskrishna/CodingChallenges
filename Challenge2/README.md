# JSON Parser

$$
\begin{align}
\text{json} &\to \text{element}
\\

\text{value} &\to
\begin{cases}
\text{object} \\
\text{array} \\
\text{string} \\
\text{number} \\
\text{"true"} \\
 \text{"false"} \\
\text{"null"} \\
\end{cases}

\\

\text{object}  &\to
\begin{cases}
\text{'\{' \text{ws} '\}'} \\
 \text{ '\{' \text{members}  '\}' }
\end{cases}

\\
\text{members}  &\to
\begin{cases}
\text{member}  \\
 \text{member ',' \text{members}}
\end{cases}
\\


\text{member}  &\to
\text{ws} \space \text{string} \space \text{ws} ':' \text{element}

\\
\text{array}  &\to
\begin{cases}
\text{'[' \text{ws} ']'} \\
\text{'[' \text{elements} ']'}
\end{cases}
\\

\text{elements} &\to
\begin{cases}
\text{element} \\
\text{element ',' elements}
\end{cases}
\\

\text{element} &\to \text{ws} \; \text{value} \; \text{ws}
\\

\text{string} &\to \text{'"'} \; \text{characters} \; \text{'"'}
\\

\text{characters} &\to
\begin{cases}
\epsilon \\
\text{character characters}
\end{cases}
\\

\text{character} &\to
\begin{cases}
\text{U+0020..U+10FFFF} - \{ \text{'"', '\textbackslash'} \} \\
\text{'\textbackslash' escape}
\end{cases}
\\

\text{escape} &\to
\begin{cases}
\text{'"'} \\
\text{'\textbackslash'} \\
\text{'/'} \\
\text{'b'} \\
\text{'f'} \\
\text{'n'} \\
\text{'r'} \\
\text{'t'} \\
\text{'u' hex hex hex hex}
\end{cases}
\\

\text{hex} &\to
\begin{cases}

\text{digit}\\
 \text{A..F}\\
  \text{a..f}
\end{cases}

\\

\text{number} &\to \text{integer fraction exponent}
\\

\text{integer} &\to
\begin{cases}
\text{digit} \\
\text{onenine digits} \\
\text{'-' digit} \\
\text{'-' onenine digits}
\end{cases}
\\

\text{digits} &\to 
\begin{cases}
\text{digit} \\
\text{digit digits}
\end{cases}
\\

\text{digit} &\to \begin{cases}
\text{'0'} \\
\text{onenine}
\end{cases}
\\

\text{onenine} &\to \text{'1'..'9'}
\\

\text{fraction} &\to 
\begin{cases}
 \epsilon \\
  \text{'.' digits}

\end{cases}
\\

\text{exponent} &\to
\begin{cases}
\epsilon \\
\text{'E' sign digits} \\
\text{'e' sign digits}
\end{cases}
\\

\text{sign} &\to
 \begin{cases}
 \epsilon \\
  \text{'+'} \\
   \text{'-'}

 \end{cases}
\\

\text{ws} &\to
\begin{cases}
\epsilon \\
\text{U+0020 ws} \\
\text{U+000A ws} \\
\text{U+000D ws} \\
\text{U+0009 ws}
\end{cases}


\end{align}
$$

```graphql
LBRACE      {  
STRING      "a"  
COLON       :  
LBRACKET    [  
NUMBER      1  
COMMA       ,  
TRUE        true  
RBRACKET    ]  
RBRACE      }  
```