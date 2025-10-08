export const SID_LACY_COVER_LETTER = String.raw`
% Project:  TeX Cover Letter Template
% Author:   Sid Lacy
% All content merged into single file

\documentclass[12pt]{letter}
\usepackage[utf8]{inputenc}
\usepackage[empty]{fullpage}
\usepackage[hidelinks]{hyperref}
\usepackage{graphicx}
\usepackage{fontawesome5}
\usepackage{eso-pic}
\usepackage{charter}

\addtolength{\topmargin}{-0.5in}
\addtolength{\textheight}{1.0in}
\definecolor{gr}{RGB}{225,225,225}

% ============================================
% PERSONAL AND COMPANY INFORMATION (from info.tex)
% ============================================
% Personal information
\newcommand{\myname}{John Doe}
\newcommand{\mytitle}{Applicant}
\newcommand{\myemail}{john@johndoe.com}
\newcommand{\mylinkedin}{johndoe}
\newcommand{\myphone}{123.456.7890}
\newcommand{\mylocation}{City, ST}
\newcommand{\recipient}{Hiring Manager}
\newcommand{\greeting}{Dear}
\newcommand{\closer}{Kind Regards}

% Company information
\newcommand{\company}{Microsoft Corporation}
\newcommand{\street}{1 Microsoft Way}
\newcommand{\city}{Redmond}
\newcommand{\state}{WA}
\newcommand{\zip}{98052}

\begin{document}

% Shaded header banner
\AddToShipoutPictureBG{%
\color{gr}
\AtPageUpperLeft{\rule[-1.3in]{\paperwidth}{1.3in}}
}

% Header
\begin{center}
{\fontsize{28}{0}\selectfont\scshape \myname}

\href{mailto:\myemail}{\faEnvelope\enspace \myemail}\hfill
\href{https://linkedin.com/in/\mylinkedin}{\faLinkedinIn\enspace linkedin.com/in/\mylinkedin}\hfill
\href{tel:\myphone}{\faPhone\enspace \myphone}\hfill
\faMapMarker\enspace \mylocation
\end{center}

\vspace{0.2in}

% Opening block
\today\\

\recipient\\
\company\\
\street\\
\city, \state\ \zip\\

\vspace{-0.1in}\greeting\ \recipient,\\

% ============================================
% BODY CONTENT (from body.tex)
% ============================================
\vspace{-0.1in}\setlength\parindent{24pt}

\noindent Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam ultrices aliquet. Cras ac placerat ex, non rhoncus tortor. Phasellus accumsan sit amet felis vitae varius. Nullam efficitur lorem nec orci scelerisque, commodo rutrum arcu varius. Nullam orci metus, rutrum sit amet enim sit amet, luctus rutrum metus. Vivamus commodo, quam a euismod venenatis, felis lorem porta massa, ac cursus massa nibh eu lectus. Duis pretium in elit nec sodales. Vivamus consectetur tristique ante eget ultricies. Cras sed lectus luctus, commodo urna fringilla, placerat urna.

Aliquam ut ligula orci. Sed cursus interdum ante, et cursus erat aliquam vel. Maecenas sodales ligula mattis condimentum convallis. Donec aliquet ut libero eget dignissim. Etiam gravida bibendum venenatis. Maecenas accumsan magna lectus. Mauris leo urna, tincidunt at eros vel, consequat varius urna. Curabitur blandit, nunc sed ultricies vehicula, neque turpis blandit massa, pulvinar ultrices orci ligula et enim. Morbi at efficitur ipsum. Aliquam ullamcorper consequat nunc, quis pulvinar orci facilisis sit amet. Pellentesque volutpat quam vitae luctus euismod.

Aliquam ut ligula orci. Sed cursus interdum ante, et cursus erat aliquam vel. Maecenas sodales ligula mattis condimentum convallis. Donec aliquet ut libero eget dignissim. Etiam gravida bibendum venenatis. Maecenas accumsan magna lectus. Mauris leo urna, tincidunt at eros vel, consequat varius urna. Curabitur blandit, nunc sed ultricies vehicula, neque turpis blandit massa, pulvinar ultrices orci ligula et enim. Morbi at efficitur ipsum. Aliquam ullamcorper consequat nunc, quis pulvinar orci facilisis sit amet. Pellentesque volutpat quam vitae luctus euismod.

% Closer
\vspace{0.1in}
\vfill

\begin{flushright}
\closer,

\vspace{-0.1in}\includegraphics[width=1.5in]{signature}\vspace{-0.1in}

\myname\\
\mytitle
\end{flushright}

\end{document}
`;
