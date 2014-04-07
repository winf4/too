catImage       = new Image( "catFace.jpg" )
catSound       = new Sound( "cat-meow2.mp3" )

gameState = "title"
theGUI = new GUI()

// The code inside this do block is run each frame
onEachFrame() do
    fill( 0, 0, 0 )
    if( gameState == "title" )
        theGUI.drawHeadline()
        theGUI.drawSubtitle()
        gameState = keyToChangeState( gameState, "space", "init" )
    else if( gameState == "init" )
        reactionTest = new ReactionTest( catImage, catSound )
        gameState = "game"
    else if( gameState == "game" )
        if( reactionTest.checkTime() )
            reactionTest.drawReactionTest()
        end
        reactionTest.getReactionTime()
        theGUI.setSubtitle( "Press space when the image appears..." )
        theGUI.drawSubtitle()
        gameState = keyToChangeState( gameState, "space", "tryAgain" )
    else if( gameState == "tryAgain" )
        //if the player hasn't pressed too soon...
        if( reactionTest.getScore() > 0 ) 
            theGUI.drawScore(reactionTest.getScore())
            theGUI.setHeadline( "Reaction Time:" )
            theGUI.setSubtitle( "Have another go! Press space." )
        else
            theGUI.setHeadline( "FOUL!" )
            theGUI.setSubtitle( "You pressed too soon! Space to try again." )
        end
        theGUI.drawHeadline()
        theGUI.drawSubtitle()
            
        gameState = keyToChangeState( gameState, "space", "init" )
        
    end
end

class ReactionTest
    def new( image, sound )
        @image = image
        @sound = sound
        @currentTime = getTime()    //get the time now
        @reactionRandom = rand(5000) //up to 5 seconds
        @reactionBase = 3000    //our reaction img won't appear for at least 3 secs
        @reactionTime = 0       //the time it takes the person to react
        @finalScore = 0
        @imageShown = false
        
        @showImageAt = @currentTime + @reactionRandom + @reactionBase
//        @sound.setRepeating( false )
    end
    
    //get the time now (as the game progresses)
    def checkTime()
        if( getTime() > @showImageAt )
            return true
        end
    end
    
    def getReactionTime()
        controls = getControls()
        
        if controls.isKeyPressed( "space" )
            @reactionTime = getTime()
        end
        @score = @reactionTime - ( @currentTime + @reactionRandom + @reactionBase )
    end
    
    def drawReactionTest()
        if @imageShown == false
           @sound.play() 
           @imageShown = true
        end
        
        setColor( 255,255,255 )
        drawImage( @image, 0, 0 )
    end
    
    //so we can give the score as a number to the GUI
    def getScore()
        return @score
    end
end

//This is for title/game over messages, displaying the score etc
class GUI
    def new()
        //Headline is for Title/Game Over messages
        @headlineX = getScreenWidth() / 2
        @headlineY = 140
        @headlineText = "Reaction Test"

        //Message is for "try again"-type messages 
        @subtitleX = getScreenWidth() / 2
        @subtitleY = 300
        @messageText = "Press space to play."

        //The score co-ords
        @scoreX = getScreenWidth() / 2
        @scoreY = 230

        //Finally, the colour of our text- an array
        @colour = [ 240, 240, 240 ]
    end

    def setHeadline( text )
        @headlineText = text
    end

    def setSubtitle( text )
        @messageText = text
    end

    def drawHeadline()
        /*
        If you want to change font or colour you have to set these again
        */
        setFont( 'Helvetica, arial, sans-serif', 60, 'bold' )
        setColor( @colour[0], @colour[1], @colour[2] )
        /*
        The "true" parameter makes it handle text from its centre.
        */
        fillText( @headlineText, @headlineX, @headlineY, true ) 
    end

    def drawSubtitle()
        setFont( 'Helvetica, arial, sans-serif', 25 )
        setColor( @colour[0], @colour[1], @colour[2] )
        fillText( @messageText, @headlineX, @subtitleY, true ) 
    end

    def drawScore( score )
        setFont( 'Helvetica, arial, sans-serif', 100, 'bold' )
        setColor( @colour[0], @colour[1], @colour[2] )
        fillText( score.round() + "ms", @scoreX, @scoreY, true ) 
    end
end

def keyToChangeState( current, key, next )
    if getControls().isKeyPressed( key )
        return next
    else
        return current
    end
end