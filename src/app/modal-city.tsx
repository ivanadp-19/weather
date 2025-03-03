import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface CityNotFoundModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CityNotFoundModal({ isOpen, onClose }: CityNotFoundModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>City Not Found</DialogTitle>
          <DialogDescription>
            The city you searched for does not exist in our database. Please try another city name.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

