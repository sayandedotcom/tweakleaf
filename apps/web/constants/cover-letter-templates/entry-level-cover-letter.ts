export const ENTRY_LEVEL_COVER_LETTER = String.raw`
%-------------------------
% Entry-level Cover-letter Template in LaTeX
% Made to go with "Entry-level Resume in laTeX" - here
% Version - v1.0
% Last Edits - October 5, 2021
% Author : Jayesh Sanwal
% Reach out to me on LinkedIn(/in/jsanwal), with any suggestions, ideas, issues, etc.
%------------------------


%%%%%%% --------------------------------------------------------------------------------------
%%%%%%%  STARTING HERE, DO NOT TOUCH ANYTHING 
%%%%%%% --------------------------------------------------------------------------------------

%%%% Define Document type
\documentclass[11pt,a4]{article}

%%%% Include Packages
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
 \usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage{multicol}
\usepackage{hyperref}
\usepackage{csquotes}
\usepackage{tabularx}
\hypersetup{colorlinks=true,urlcolor=black}
\usepackage[11pt]{moresize}
\usepackage{setspace}
\usepackage{fontspec}
\usepackage[inline]{enumitem}
\usepackage{ragged2e}
\usepackage{anyfontsize}

%%%% Set Margins
\usepackage[margin=1cm]{geometry}

%%%% Set Fonts
\setmainfont[
BoldFont=SourceSansPro-Semibold.otf,
ItalicFont=SourceSansPro-RegularIt.otf
]{SourceSansPro-Regular.otf}

%%%% Set Page Style
\pagestyle{fancy}
\fancyhf{} 
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

%%%% Set URL Style
\urlstyle{same}

%%%% Set Indentation
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

%%%% Set Secondary Color, Page Number Color, Footer Text
\definecolor{UI_blue}{RGB}{32, 64, 151}
\definecolor{HF_color}{RGB}{179, 179, 179}
\rfoot{{\color{HF_color} \thepage \ of \ 1, Updated \today}}

%%%% Set Heading Format
\titleformat{\section}{
\color{UI_blue} \scshape \raggedright \large 
}{}{0em}{}[\vspace{-0.7cm} \hrulefill \vspace{-0.2cm}]
%%%%%%% --------------------------------------------------------------------------------------
%%%%%%% --------------------------------------------------------------------------------------
%%%%%%%  END OF "DO NOT TOUCH" REGION
%%%%%%% --------------------------------------------------------------------------------------
%%%%%%% --------------------------------------------------------------------------------------



\begin{document}
%%%%%%% --------------------------------------------------------------------------------------
%%%%%%%  HEADER
%%%%%%% --------------------------------------------------------------------------------------
\begin{center}
    \begin{minipage}[b]{0.24\textwidth}
            \large (xxx)-xxx-xxxx \\
            \large \href{mailto:youremail@email.com}{youremail@email.com} 
    \end{minipage}% 
    \begin{minipage}[b]{0.5\textwidth}
            \centering
            {\Huge John Snow} \\ %
            \vspace{0.1cm}
            {\color{UI_blue} \Large{Target Job}} \\
    \end{minipage}% 
    \begin{minipage}[b]{0.24\textwidth}
            \flushright \large
            {\href{https://www.linkedin.com/in/link/}{linkedin.com/in/yourlink} } \\
            \href{https://Add_your_portfolio_here_}{Portfolio}
    \end{minipage}   
    
\vspace{-0.15cm} 
{\color{UI_blue} \hrulefill}
\end{center}

\justify
\setlength{\parindent}{0pt}
\setlength{\parskip}{12pt}
\vspace{0.2cm}
\begin{center}
    {\color{UI_blue} \Large{COVER LETTER}}
\end{center}


%%%%%%% --------------------------------------------------------------------------------------
%%%%%%%  First 2 Lines
%%%%%%% --------------------------------------------------------------------------------------

Date: \today \par \vspace{-0.1cm}
Dear Hiring Manager, % OR To whom this may concern, 

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam vulputate dignissim suspendisse in est ante in nibh mauris. Dui sapien eget mi proin sed. Sed euismod nisi porta lorem mollis aliquam ut. In hendrerit gravida rutrum quisque non tellus orci. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis. Faucibus nisl tincidunt eget nullam non nisi est sit. Nisl rhoncus mattis rhoncus urna neque viverra justo. Pulvinar elementum integer enim neque volutpat ac tincidunt. Nunc lobortis mattis aliquam faucibus purus in. In hac habitasse platea dictumst. \par

Nibh nisl condimentum id venenatis a condimentum. Id venenatis a condimentum vitae sapien pellentesque. Id interdum velit laoreet id donec ultrices tincidunt arcu. Viverra maecenas accumsan lacus vel facilisis volutpat est. Amet aliquam id diam maecenas ultricies mi eget mauris. Arcu felis bibendum ut tristique. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Nisl nunc mi ipsum faucibus vitae. Enim nunc faucibus a pellentesque sit. Vulputate eu scelerisque felis imperdiet proin fermentum leo. Eget nulla facilisi etiam dignissim. Tortor posuere ac ut consequat semper viverra. Sit amet justo donec enim diam vulputate ut. Suspendisse sed nisi lacus sed viverra tellus in hac habitasse. Lectus arcu bibendum at varius vel pharetra vel turpis. Odio aenean sed adipiscing diam donec adipiscing tristique risus nec. Quisque sagittis purus sit amet volutpat consequat. Quis ipsum suspendisse ultrices gravida dictum fusce. A pellentesque sit amet porttitor eget dolor morbi non. Risus sed vulputate odio ut enim blandit volutpat maecenas volutpat. \par

%%%%%%% --------------------------------------------------------------------------------------
%%%%%%%  SIGNATURE
%%%%%%% --------------------------------------------------------------------------------------

\vspace{0.5cm}
\raggedright
Yours Faithfully \\ John Snow \\ (xxx)-xxx-xxxx \\ \href{mailto:youremail@email.com}{youremail@email.com}

\end{document}
`;
