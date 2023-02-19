i = 1
while i <= 66:
    #Convert to 2 digit number string
    if i < 10:
        number = "0" + str(i)
    else:
        number = str(i)

    #Open Index Filename
    infile = open("kjv/" + number, "r")
    outfile = open("temp/" + number, "w")

    chapter = 1
    for line in infile:
        line = line.strip()
        if chapter < 10:
            chapter_string = "00" + str(chapter)
        elif chapter < 100:
            chapter_string = "0" + str(chapter)
        else:
            chapter_string = str(chapter)
        outfile.write("<option value=\"" + line + "\">" + chapter_string + "</option>\n")
        
        chapter = chapter + 1
    infile.close()
    outfile.close()
    #Increment
    i = i + 1

