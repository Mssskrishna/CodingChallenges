#include <stdio.h>
#include <stdbool.h>

void numberofLines(FILE *fp, char att)
{
    char ch;
    int length = 0, bytes = 0, words = 0, characters = 0;
    bool inWord = false; // track whether the character is in word
    // for example take "hello world", at 'h', inword => true so after 'o', inword=>false starting new word
    // again at 'w', inword => true incremets word counter, after 'd' inword => false results in 3 words

    while ((ch = fgetc(fp)) != EOF)
    {
        bytes++;

        if (ch != ' ' && ch != '\n' && ch != '\r')
        {
            characters++;
            if (!inWord)
            {
                words++;
                inWord = true;
            }
        }
        else
        {
            if (ch == '\n')
                length++;
            inWord = false;
        }
    }

    switch (att)
    {
    case 'c':
        printf("%d\n", bytes);
        break;
    case 'l':
        printf("%d\n", length);
        break;
    case 'w':
        printf("%d\n", words);
        break;
    case 'm':
        printf("%d\n", characters);
        break;
    default:
        printf("%d %d %d\n", length, bytes, words);
        break;
    }
}

int main(int argc, char *argv[])
{
    char att = '\0';
    FILE *fp = stdin;
    if (argc > 1 && argv[1][0] == '-')
    {
        att = argv[1][1];
        if (argc > 2)
        {
            fp = fopen(argv[2], "r");
            if (fp == NULL)
            {
                printf("Error: Could not open file %s\n", argv[2]);
                return 1;
            }
        }
    }
    else if (argc > 1)
    {
        fp = fopen(argv[1], "r");
        if (fp == NULL)
        {
            printf("Error: Could not open file %s\n", argv[1]);
            return 1;
        }
    }

    numberofLines(fp, att);

    if (fp != stdin)
        fclose(fp);

    return 0;
}
