package sandbox.dnd;

import sandbox.scratch.TestSplitPane;

import javax.swing.*;
import java.awt.*;
import java.awt.datatransfer.DataFlavor;
import java.awt.dnd.*;

public class DroppablePanel extends JPanel {

    public enum PanelPosition {

        Left(0),
        Right(1),
        Top(2),
        Bottom(3),
        Center(4);

        private final int i;

        private PanelPosition(int i){
            this.i = i;
        }

    }

    private final PanelPosition position;
    private final DroppablePanel selfRef = this;

    public DroppablePanel(PanelPosition position){
        this.position = position;
        this.setBackground(new Color(0,255, 0, 65));
        this.setBounds(0, 0, 100, 500);
        this.setOpaque(true);
        this.setVisible(false);
        this.setBorder(BorderFactory.createLineBorder(Color.LIGHT_GRAY, 1));

        this.setTransferHandler(new TestSplitPane.ValueImportTransferHandler());

        DropTarget target = new DropTarget(this, 2, new DropTargetListener() {
            @Override
            public void dragEnter(DropTargetDragEvent dtde) {
                System.out.println("HIGHLIGHT:" + Thread.currentThread().getName() + ": dragEnter: source:" + dtde.getSource() + " loc:" + dtde.getLocation());
                selfRef.highLightMe();
                selfRef.invalidate();
            }

            @Override
            public void dragOver(DropTargetDragEvent dtde) {

                if(selfRef.hasPoint((int)dtde.getLocation().getX(), (int)dtde.getLocation().getY())){
                    System.out.println("HIGHLIGHT:" + Thread.currentThread().getName() + ": dragOver: source:" + dtde.getSource() + " loc:" + dtde.getLocation());
                    selfRef.highLightMe();
                    selfRef.invalidate();
                }else{
                    //selfRef.deHighlightMe();
                    //selfRef.invalidate();
                }


            }

            @Override
            public void dropActionChanged(DropTargetDragEvent dtde) {
                System.out.println("dropActionChanged");
            }

            @Override
            public void dragExit(DropTargetEvent dte) {
                System.out.println("dragExit");
                selfRef.deHighlightMe();
                //selfRef.hideMe();
            }

            @Override
            public void drop(DropTargetDropEvent dtde) {
                String value = "";
                try {
                    value =(String) dtde.getTransferable().getTransferData(DataFlavor.stringFlavor);
                    System.out.println("dropped:" + value);

                }catch(Exception ex){
                    System.out.println("Exception:" + ex.getMessage());
                }
            }
        });

        this.setDropTarget(target);
    }

    public boolean hasPoint(int x, int y){
        return x >= this.getX() && x < this.getX() + this.getWidth() &&
        y >= this.getY() && y < this.getY() + this.getHeight();
    }

    public void showMe(){
        this.setVisible(true);
    }

    public void highLightMe(){
        this.setBackground(new Color(255,0, 0, 65));
    }

    public void deHighlightMe(){
        this.setBackground(new Color(0,255, 0, 65));
    }

    public void hideMe(){
        this.setVisible(false);
    }

    public void setBounds(JFrame frame){
        if(this.position == PanelPosition.Left){
            setBounds(0,frame.getHeight() / 4, (frame.getWidth() / 4), frame.getHeight() / 2);
        }else if(this.position == PanelPosition.Right){
            setBounds((frame.getWidth() / 4) * 3, frame.getHeight()/4, (frame.getWidth() / 4), frame.getHeight() / 2);
        }else if(this.position == PanelPosition.Top){
            setBounds(frame.getWidth() / 4, 0, frame.getWidth() / 2, frame.getHeight() / 4);
        }else if(this.position == PanelPosition.Bottom){
            setBounds(frame.getWidth() / 4, (frame.getHeight() / 4) * 3, frame.getWidth() / 2, frame.getHeight() / 4);
        }else if(this.position == PanelPosition.Center){
            setBounds(frame.getWidth() / 4, (frame.getHeight() / 4), frame.getWidth() / 2, frame.getHeight() / 2);
        }

    }

}